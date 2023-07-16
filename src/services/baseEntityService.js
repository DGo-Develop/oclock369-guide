const addressService = require('./addressService');
const Logger = require('../utils/logger');
const stringUtils = require('../utils/stringUtils');
const officeService = require('./officeService');
const emailRepository = require('../repositories/emailRepository');
const Recipient = require('../models/recipient');
const Address = require('../models/address');
const Sender = require('../models/sender');
const Email = require('../models/email');
const { v4: uuidv4 } = require('uuid');

class BaseEntityService {
    constructor(identificationTypes, cities, departments) {
        this.logger = new Logger('base-entity-service');
        this.identificationTypes = identificationTypes;
        this.cities = cities;
        this.departments = departments;

        this.instanceAddressService = new addressService(this.cities, this.departments);
    }

    async createOrValidateEntity(data, repository, office, isloadfile, entityType) {
        if (entityType === 'sender') {
            return await this._handleSenderEntity(data, repository, office, isloadfile);
        } else {
            return await this._handleOtherEntity(data, repository, entityType, office, isloadfile);
        }
    }

    async _handleSenderEntity(data, repository, office, isloadfile) {
        const entityType = 'sender';

        if (!data) {
            const existingEntity = await repository.findByOfficeId(office.office_id);
            if (existingEntity) {
                this.logger.info(`El ${entityType} con office_id ${office.office_id} ya existe.`);
                existingEntity.address = await this._getAddress(existingEntity.address, isloadfile);
                return this._buildResponse(true, existingEntity);
            }

            this.logger.info(`El ${entityType} con office_id ${office.office_id} no existe.`);
            const client = await officeService.getClientByOfficeId(office.client_id);
            if (!client) {
                throw new Error('Invalid office ID');
            }

            data = new Sender({
                address: new Address({ address_id: office.address_id }),
                first_name: client.first_name,
                last_name: client.last_name,
                phone: client.phone,
                identification_type_id: client.identification_type_id,
                identification: client.identification,
                email: client.email,
                office_id: office.office_id
            });


            const newEntity = await this._createEntity(data, 'sender', repository);
            return this._buildResponse(true, newEntity);
        }

        if (data && data.id) {
            const existingEntity = await this.getEntityById(data.id, repository);
            if (existingEntity) {
                this.logger.info(`El ${entityType} con ID ${data.id} ya existe.`);
                return this._buildResponse(true, existingEntity);
            }
            this.logger.info(`El ${entityType} con ID ${data.id} no existe.`);
        }

        let identification_type_id = data.identification_type_id;
        if (isloadfile) {
            const identification_type_id_search = this.identificationTypes.identificationTypes.filter(x => stringUtils.compareStrings(x.name, identification_type_id))[0];
            if (identification_type_id_search) {
                data.identification_type_id = identification_type_id_search.identification_type_id;
            }
            else {
                this.logger.info(`El tipo de identificación ${data.identification_type_id} enviada para ${entityType} no existe.`);
                throw new Error(`El tipo de identificación ${data.identification_type_id} enviada para ${entityType} no existe.`);
            }
        }

        const existingEntity = await repository.findByIdentification(data.identification_type_id, data.identification);
        if (existingEntity) {
            this.logger.info(`El ${entityType} con tipo de identificación ${data.identification_type_id} y número de identificación ${data.identification} ya existe.`);
            if (!existingEntity.address) {
                existingEntity.address = await this.instanceAddressService.createAddress(existingEntity.address, data.address);
                return this._buildResponse(true, existingEntity);
            }

            existingEntity.address = await this._getAddress(existingEntity.address, data.address, isloadfile);
            return this._buildResponse(true, existingEntity);
        }
        this.logger.info(`El ${entityType} con tipo de identificación ${data.identification_type_id} y número de identificación ${data.identification} no existe.`);

        const addressExists = await this.instanceAddressService.addressExists(data.address, isloadfile);
        if (!addressExists) {
            this.logger.info(`No fue posible obtener la dirección ${JSON.stringify(data.address)}`);
            return this._buildResponse(false);
        }

        data.address.address_id = addressExists.address_id;

        const newEntity = await this._createEntity(data, office, entityType, repository);
        return this._buildResponse(true, newEntity);
    }

    async _handleOtherEntity(data, repository, entityType, office, isloadfile) {
        if (data && data.id) {
            const existingEntity = await this.getEntityById(data.id, repository);
            if (existingEntity) {
                this.logger.info(`El ${entityType} con ID ${data.id} ya existe.`);
                return this._buildResponse(true, existingEntity);
            }
            this.logger.info(`El ${entityType} con ID ${data.id} no existe.`);
        }

        let identification_type_id = data.identification_type_id;
        if (isloadfile) {
            const identification_type_id_search = this.identificationTypes.identificationTypes.filter(x => stringUtils.compareStrings(x.name, identification_type_id))[0];
            if (identification_type_id_search) {
                data.identification_type_id = identification_type_id_search.identification_type_id;
            }
            else {
                this.logger.info(`El tipo de identificación ${identification_type_id} enviada para ${entityType} no existe.`);
                throw new Error(`El tipo de identificación ${identification_type_id} enviada para ${entityType} no existe.`);
            }
        }

        const existingEntity = await repository.findByIdentification(data.identification_type_id, data.identification);
        if (existingEntity) {
            this.logger.info(`El ${entityType} con tipo de identificación ${data.identification_type_id} y número de identificación ${data.identification} ya existe.`);
            existingEntity.address = await this._getAddress(existingEntity.address, data.address, isloadfile);
            return this._buildResponse(true, existingEntity);
        }
        this.logger.info(`El ${entityType} con tipo de identificación ${data.identification_type_id} y número de identificación ${data.identification} no existe.`);

        const addressExists = await this.instanceAddressService.addressExists(data.address, isloadfile);
        if (!addressExists) {
            this.logger.info(`No fue posible obtener la dirección ${JSON.stringify(data.address)}`);
            return this._buildResponse(false);
        }

        data.address.address_id = addressExists.address_id;

        const newEntity = await this._createEntity(data, office, entityType, repository);
        return this._buildResponse(true, newEntity);
    }

    async getEntityById(id, repository) {
        this.logger.info(`Request for repository getEntityById params: [id: ${id}]`);
        const entity = await repository.getEntityById(id);
        return entity;
    }

    async _getAddress(addressEntity, addressRequest, isloadfile) {
        const existingAddress = await this.instanceAddressService.addressExists(addressEntity, isloadfile);
        if (existingAddress && !addressRequest) {
            return new Address(existingAddress);
        }

        if (existingAddress && addressRequest && existingAddress.street == addressRequest.street) {
            return new Address(existingAddress);
        }

        const newAddress = await this.instanceAddressService.createAddress(addressRequest, isloadfile);
        return new Address({ ...newAddress });
    }

    _buildResponse(status, entity = null) {
        if (entity) {
            return {
                status: status,
                [entity.constructor.name.toLowerCase()]: entity
            }
        } else {
            return {
                status: status,
                message: `No se pudo encontrar o crear la entidad`
            };
        }
    }

    _createEntityInstance(data, entityType) {
        if (entityType === 'sender') {
            return new Sender(data);
        } else if (entityType === 'recipient') {
            return new Recipient(data);
        }
        throw new Error(`Tipo de entidad no soportado: ${entityType}`);
    }

    async _createEntity(data, office, entityType, repository) {
        this.logger.info(`Creando ${entityType}`);
        const newEntityData = {
            ...data,
            office_id: office.office_id,
            address: new Address(data.address),
            [`${entityType}_id`]: uuidv4(),
            status: true,
        };

        const entityInstance = this._createEntityInstance(newEntityData, entityType);
        const entity = await repository.create(entityInstance);

        if (data.emails && Array.isArray(data.emails)) {
            for (const email of data.emails) {
                const emailInstance = new Email({
                    email_id: uuidv4(),
                    email_address: email,
                    email_type: entityType,
                    owner_id: entityInstance[`${entityType}_id`],
                });

                await emailRepository.create(emailInstance);
            }
        }

        return entity;
    }
}

module.exports = BaseEntityService;

