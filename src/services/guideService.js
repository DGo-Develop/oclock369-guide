const guideRepository = require('../repositories/guideRepository');
const senderService = require('../services/senderService');
const recipientService = require('../services/recipientService');
const officeService = require('../services/officeService');
const AddressService = require('../services/addressService');
const guideStatusService = require('../services/guideStatusService');
const cityService = require('./cityService');
const zoneService = require('./zoneService');
const barcodeService = require('./barcodeService');
const identificationTypeService = require('./identificationTypeService');

const Guide = require('../models/guide');
const GuideConstant = require('../constants/guideConstant');
const Sender = require('../models/sender');
const Recipient = require('../models/recipient');
const DateTimeHelper = require('../helpers/dateTimeHelper');
const GuideNumberGenerator = require('../helpers/guideNumberGenerator');

const { v4: uuidv4 } = require('uuid');
const Logger = require('../utils/logger');
const PDFGenerator = require('../utils/PDFGenerator');
const TemplateRenderer = require('../utils/TemplateRenderer');
const Email = require('../models/email');
const departmentService = require('./departmentService');
const ErrorHandler = require('../utils/errorHandler');
const { AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY } = process.env;
const TABLE_NAME = 'guideNumbers';

class GuideService {
    constructor() {
        this.logger = new Logger('guide-service');
        this.errorHandler = new ErrorHandler(this.logger);
        this.dateTimeHelper = new DateTimeHelper();
        this.guideNumberGenerator = new GuideNumberGenerator(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY, TABLE_NAME);
        this.barcodeService = new barcodeService(this.logger);
        this.addressService = new AddressService();
    }

    async getSender(senderData, office, isloadfile, identificationTypes, cities, departments) {
        const instanceSenderService = new senderService(identificationTypes, cities, departments)
        const sender_ = await instanceSenderService.createOrValidateSender(senderData, office, isloadfile);
        if (!sender_.status) {
            this.errorHandler.logAndThrowError('Failed to create or validate sender');
        }
        return sender_.sender;
    }

    async getRecipient(recipientData, office, isloadfile, identificationTypes, cities, departments) {
        const instanceSenderService = new recipientService(identificationTypes, cities, departments)
        const recipient_ = await instanceSenderService.createOrValidateRecipient(recipientData, office, isloadfile);
        if (!recipient_.status) {
            this.errorHandler.logAndThrowError('Failed to create or validate recipient');
        }
        return recipient_.recipient;
    }

    getQRCodeData(guideNumber) {
        return this.barcodeService.getQRCodeData(guideNumber);
    }

    async createGuideInstance(guideData, senderId, recipientId, statusGuideId) {
        const { date, time } = this.dateTimeHelper.getCurrentDateTime();
        const guideNumber = await this.guideNumberGenerator.generateGuideNumber();
        const dateNextBussinesDay = this.dateTimeHelper.getNextBusinessDay(date);

        const guide = new Guide({
            ...guideData,

            date_probable_delivery: dateNextBussinesDay,
            hour_probable_delivery: time,
            date_created: date,
            hour_created: time,
            sender_id: senderId,
            recipient_id: recipientId,
            guide_id: uuidv4(),
            guide_number: guideNumber,
            status_guide_id: statusGuideId,
            freight_value: 0,
            total_value: guideData.declared_value,
            over_freight_value: 0,

            volumetric_weight: ((guideData.height ?? 0 * guideData.length ?? 0 * guideData.width ?? 0) * (222)) / 1000000
        });

        await guideRepository.create(guide);
        return guide;
    }

    async createGuides(guideDataArray, isloadfile) {
        const result = [];
        const identificationTypes = await identificationTypeService.getidentificationTypes();
        const cities = await cityService.getAllCities();
        const departments = await departmentService.getAllDepartments();

        for (const [registerNumber, guideData] of guideDataArray.entries()) {
            let resultObject = {
                status: true,
                observations: null,
                registerNumber: registerNumber + 1
            };

            try {
                const { sender, recipient, office_id } = guideData;
                const guideResult = await this.createGuide(guideData, sender, recipient, office_id, isloadfile, identificationTypes, cities, departments);
                resultObject = { ...resultObject, ...guideResult };
            } catch (error) {
                resultObject.status = false;
                resultObject.observations = error.message;

                this.logger.error(`Error creating guide: ${error.message}`);
            }

            result.push(resultObject);
        }
        return result;
    }

    async createGuide(guideData, sender, recipient, office_id, isloadfile, identificationTypes, cities, departments) {
        const office = await this.validateOffice(office_id);
        const senderResult = await this.getSender(sender, office, isloadfile, identificationTypes, cities, departments);
        const recipientResult = await this.getRecipient(recipient, office, isloadfile, identificationTypes, cities, departments);
        const statusGuide = await this.validateGuideStatus(GuideConstant.STATUS_GUIDE_CODE_DEFAULT);
        const createdGuide = await this.createGuideInstance(guideData, senderResult.sender_id, recipientResult.recipient_id, statusGuide.status_guide_id);

        return isloadfile ? this.constructLoadFileResult(createdGuide) : await this.constructRegularResult(createdGuide, senderResult, recipientResult);
    }

    async validateOffice(office_id) {
        const office = await officeService.officeExists(office_id);
        if (!office) {
            this.errorHandler.logAndThrowError('Invalid office ID');
        }
        return office;
    }

    async validateGuideStatus(status) {
        const statusGuide = await guideStatusService.getGuideStatusByName(status);
        if (!statusGuide) {
            this.errorHandler.logAndThrowError('Invalid guide status ID');
        }
        return statusGuide;
    }

    constructLoadFileResult(createdGuide) {
        return {
            guide_id: createdGuide.guide_id,
            guide_number: createdGuide.guide_number,
            zone_id: createdGuide.zone_id
        }
    }

    async constructRegularResult(createdGuide, senderResult, recipientResult) {
        const sender_ = new Sender(senderResult);
        const recipient_ = new Recipient(recipientResult);

        const cityRecipient = await cityService.getCityById(recipient_.address.city_id);
        const citySender = await cityService.getCityById(sender_.address.city_id);

        const zoneRecipient = await zoneService.getZoneById(recipient_.address.zone_id);
        const zoneSender = await zoneService.getZoneById(sender_.address.zone_id);

        const qrData = await this.getQRCodeData(createdGuide.guide_number);

        const barcodeBase64 = await this.barcodeService.generateBarcode(createdGuide.guide_number);
        const qrCodeBase64 = await this.barcodeService.generateQRCode(qrData);

        const htmlTemplate = await TemplateRenderer.loadHTMLTemplate('guia');
        const data = [
            { 'FECHA_RECEPCION': createdGuide.date_created },
            { 'H_R': createdGuide.hour_created },
            { 'FECHA_ENTREGA': createdGuide.date_probable_delivery },
            { 'H_EE': createdGuide.hour_probable_delivery },
            { 'Z_R': zoneRecipient.name },
            { 'NOMBRES_Y_APELLIDOS_REMITENTE': `${sender_.first_name} ${sender_.last_name}` },
            { 'DIRECCIÓN_REMITENTE': sender_.address.street },
            { 'TELÉFONO_REMITENTE': sender_.phone },
            { 'CIUDAD_DEPARTAMENTO_PAÍS_REMITENTE': `${citySender.name} - ${citySender.department.name} - ${citySender.country.name}` },
            { 'VR_TOTAL': `$${createdGuide.total_value}` },
            { 'VD_REMITEN': `$${createdGuide.declared_value}` },
            { 'PESO_VOL': createdGuide.volumetric_weight },
            { 'VR_FLETE': `$${createdGuide.freight_value}` },
            { 'NO_REMISION': createdGuide.remission },
            { 'PESO_KG': createdGuide.weight },
            { 'VR_RECAUDO': `$${createdGuide.collection_value}` },
            { 'NUMERO_GUIA_EXAMPLE': createdGuide.guide_number },
            { 'Z_E': zoneSender.name },
            { 'NOMBRES_Y_APELLIDOS_DESTINATARIO': `${recipient_.first_name} ${recipient_.last_name}` },
            { 'DIRECCIÓN_DESTINATARIO': recipient_.address.street },
            { 'TELÉFONO_DESTINATARIO': recipient_.phone },
            { 'CIUDAD_DEPARTAMENTO_PAÍS_DESTINATARIO': `${cityRecipient.name} - ${cityRecipient.department.name} - ${cityRecipient.country.name}` },
            { 'DICE_CONTENER': createdGuide.must_contain },
            { 'OBSERVACIONES_EN_LA_ENTREGA': createdGuide.delivery_remarks },
            { 'CODIGO_BAR_GUIA': barcodeBase64 },
            { 'QR_REMITENTE': qrCodeBase64 },
            { 'QR_DESTINATARIO': qrCodeBase64 },
        ];
        const html = TemplateRenderer.replacePlaceholders(htmlTemplate, data);

        const imageSize = { width: 1700, height: 700 };
        const imageBuffer = await PDFGenerator.generateImageFromHtml(html, imageSize);
        const pdfBase64 = await PDFGenerator.generatePDFWithImage(imageBuffer);

        return {
            guide_number: createdGuide.guide_number,
            pdf: pdfBase64,
        };
    }

    async guideById(guideId) {
        const { guideRows, emailRows } = await guideRepository.guideById(guideId);
        if (!guideRows) return null;

        const senderEmails = emailRows.filter(email => email.owner_id === guideRows[0].sender_id).map(Email.fromDatabaseRow);
        const recipientEmails = emailRows.filter(email => email.owner_id === guideRows[0].recipient_id).map(Email.fromDatabaseRow);

        const guide = Guide.fromDatabaseRow(guideRows[0]);
        const recipient = Recipient.fromDatabaseRow(guideRows[0], recipientEmails);
        const sender = Sender.fromDatabaseRow(guideRows[0], senderEmails);

        const [
            office,
            senderAddress,
            recipientAddress,
            senderCity,
            senderZone,
            recipientCity,
            recipientZone,
        ] = await Promise.all([
            officeService.officeExists(guide.office_id),
            this.addressService.addressExists(sender.address),
            this.addressService.addressExists(recipient.address),
            cityService.getCityById(sender.address.city_id),
            zoneService.getZoneById(sender.address.zone_id),
            cityService.getCityById(recipient.address.city_id),
            zoneService.getZoneById(recipient.address.zone_id),
        ]);

        guide.office = office;
        sender.address = senderAddress;
        sender.address.city = senderCity;
        sender.address.zone = senderZone;
        recipient.address = recipientAddress;
        recipient.address.city = recipientCity;
        recipient.address.zone = recipientZone;

        guide.recipient = new Recipient(recipient).toSafeObject();
        guide.sender = new Sender(sender).toSafeObject();

        return guide;
    }

    async guideByNumber(guideNumber) {
        const { guideRows, emailRows } = await guideRepository.guideByNumber(guideNumber);
        if (!guideRows) return null;

        const guide = Guide.fromDatabaseRow(guideRows[0]);
        
        const [sender, recipient] = await Promise.all([
            this.getUserDetails(guideRows[0].sender_id, guideRows[0], emailRows),
            this.getUserDetails(guideRows[0].recipient_id, guideRows[0], emailRows)
        ]);

        const [
            office,
            senderAddressDetails,
            recipientAddressDetails
        ] = await Promise.all([
            officeService.officeExists(guide.office_id),
            this.getAddressDetails(sender.address),
            this.getAddressDetails(recipient.address)
        ]);

        guide.office = office;
        sender.address = senderAddressDetails;
        recipient.address = recipientAddressDetails;

        const newGuide =  new Guide(guide).toSafeObject();

        newGuide.recipient = new Recipient(recipient).toSafeObject();
        newGuide.sender = new Sender(sender).toSafeObject();

        return newGuide;
    }

    async getUserDetails(userId, guideRow, emailRows) {
        const emails = emailRows.filter(email => email.owner_id === userId).map(Email.fromDatabaseRow);
        return userId === guideRow.sender_id
            ? Sender.fromDatabaseRow(guideRow, emails)
            : Recipient.fromDatabaseRow(guideRow, emails);
    }

    async getAddressDetails(address) {
        const [addressExists, city, zone] = await Promise.all([
            this.addressService.addressExists(address),
            cityService.getCityById(address.city_id),
            zoneService.getZoneById(address.zone_id)
        ]);

        return {
            ...addressExists,
            city,
            zone
        };
    }

    async getUnassignedGuides(page, pageSize) {
        try {
            const unassignedGuidesPaginated = await guideRepository.getUnassignedGuides(page, pageSize);

            const guidePromises = unassignedGuidesPaginated.data.map(guide_number => this.guideByNumber(guide_number));
            const guides = await Promise.all(guidePromises);

            return {
                guides: guides.filter(guide => guide !== null),
                page,
                pageSize,
                totalCount: unassignedGuidesPaginated.totalCount,
                totalPages: Math.ceil(unassignedGuidesPaginated.totalCount / pageSize),
            };
        } catch (error) {
            this.errorHandler.logAndThrowError(`Error getting unassigned guides: ${error.message}`);
        }
    }
}

module.exports = new GuideService
