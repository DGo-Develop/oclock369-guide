const DateTimeHelper = require('../helpers/dateTimeHelper');
const { dateTimeHelper } = require('../services/guideService');
class Guide {
    constructor({
        guide_id,
        guide_number,
        sender_id,
        recipient_id,
        type,
        priority,
        must_contain,
        custom_field1,
        custom_field2,
        custom_field3,
        custom_field4,
        declared_value,
        collection_value,
        freight_value,
        over_freight_value,
        total_value,
        weight,
        height,
        length,
        volumetric_weight,
        suggested_collection_date,
        status_guide_id,
        office_id,
        date_created,
        hour_created,
        date_probable_delivery,
        hour_probable_delivery,
        delivery_remarks,
        width,
        remission,
    }) {
        this.guide_id = guide_id;
        this.guide_number = guide_number;
        this.sender_id = sender_id;
        this.recipient_id = recipient_id;
        this.type = type;
        this.priority = priority;
        this.must_contain = must_contain;
        this.custom_field1 = custom_field1;
        this.custom_field2 = custom_field2;
        this.custom_field3 = custom_field3;
        this.custom_field4 = custom_field4;
        this.declared_value = declared_value;
        this.collection_value = collection_value;
        this.freight_value = freight_value;
        this.over_freight_value = over_freight_value;
        this.total_value = total_value;
        this.width = width;
        this.weight = weight;
        this.height = height;
        this.length = length;
        this.volumetric_weight = volumetric_weight;
        this.suggested_collection_date = suggested_collection_date;
        this.status_guide_id = status_guide_id;
        this.office_id = office_id;
        this.date_created = date_created;
        this.hour_created = hour_created;
        this.date_probable_delivery = date_probable_delivery;
        this.hour_probable_delivery = hour_probable_delivery;
        this.delivery_remarks = delivery_remarks;
        this.remission = remission;
    }

    toSafeObject() {
        return {
            guide_number: this.guide_number,
            type: this.type,
            priority: this.priority,
            must_contain: this.must_contain,
            custom_field1: this.custom_field1,
            custom_field2: this.custom_field2,
            custom_field3: this.custom_field3,
            custom_field4: this.custom_field4,
            declared_value: this.declared_value,
            collection_value: this.collection_value,
            freight_value: this.freight_value,
            over_freight_value: this.over_freight_value,
            total_value: this.total_value,
            width: this.width,
            weight: this.weight,
            height: this.height,
            length: this.length,
            volumetric_weight: this.volumetric_weight,
            suggested_collection_date: this.suggested_collection_date,
            //status_guide_id: this.status_guide_id,
            //office_id: this.office_id,
            date_created: this.date_created,
            hour_created: this.hour_created,
            date_probable_delivery: this.date_probable_delivery,
            delivery_remarks: this.delivery_remarks,
            remission: this.remission,
        };
    }

    toDatabaseRow() {
        return {
            guide_id: this.guide_id,
            guide_number: this.guide_number,
            sender_id: this.sender_id,
            recipient_id: this.recipient_id,
            type: this.type,
            priority: this.priority,
            must_contain: this.must_contain,
            custom_field1: this.custom_field1,
            custom_field2: this.custom_field2,
            custom_field3: this.custom_field3,
            custom_field4: this.custom_field4,
            declared_value: this.declared_value,
            collection_value: this.collection_value,
            freight_value: this.freight_value,
            over_freight_value: this.over_freight_value,
            total_value: this.total_value,
            width: this.width,
            weight: this.weight,
            height: this.height,
            length: this.length,
            volumetric_weight: this.volumetric_weight,
            suggested_collection_date: this.suggested_collection_date,
            status_guide_id: this.status_guide_id,
            office_id: this.office_id,
            date_created: `${this.date_created} ${this.hour_created}`,
            date_probable_delivery: `${this.date_probable_delivery} ${this.hour_probable_delivery}`,
            delivery_remarks: this.delivery_remarks,
            remission: this.remission,
        };
    }

    static fromDatabaseRow(row) {

        const dateTimeHelper = new DateTimeHelper();
        let { date: creationDate, time: creationTime } = dateTimeHelper.getDateTime(row.date_created);
        let { date: probableDate, time: probableTime } = dateTimeHelper.getDateTime(row.date_probable_delivery);

        return {
            guide_id: row.guide_id,
            guide_number: row.guide_number,
            sender_id: row.sender_id,
            recipient_id: row.recipient_id,
            type: row.type,
            priority: row.priority,
            must_contain: row.must_contain,
            custom_field1: row.custom_field1,
            custom_field2: row.custom_field2,
            custom_field3: row.custom_field3,
            custom_field4: row.custom_field4,
            declared_value: row.declared_value,
            collection_value: row.collection_value,
            freight_value: row.freight_value,
            over_freight_value: row.over_freight_value,
            total_value: row.total_value,
            width: row.width,
            weight: row.weight,
            height: row.height,
            length: row.length,
            volumetric_weight: row.volumetric_weight,
            suggested_collection_date: row.suggested_collection_date,
            status_guide_id: row.status_guide_id,
            office_id: row.office_id,
            date_created: `${creationDate} ${creationTime}`,
            date_probable_delivery: `${probableDate} ${probableTime}`,
            delivery_remarks: row.delivery_remarks,
            remission: row.remission,
        };
    }
}

module.exports = Guide;