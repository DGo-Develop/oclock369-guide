const swaggerSchemas = {
    Address: {
        type: 'object',
        properties: {
            address_id: { type: 'string' },
            street: { type: 'string' },
            country_id: { type: 'string' },
            department_id: { type: 'string' },
            city_id: { type: 'string' },
            zone_id: { type: 'string', nullable: true },
            latitude: { type: 'number', format: 'double' },
            longitude: { type: 'number', format: 'double' },
        },
    },
    DeliveryAttempt: {
        type: 'object',
        properties: {
            delivery_attempt_id: { type: 'string' },
            guide_id: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            observation: { type: 'string' },
            delivery_status: { type: 'boolean' },
            non_delivery_reason_id: { type: 'string' },
            non_collection_reason_id: { type: 'string' },
            truck_id: { type: 'string' },
        },
    },
    GuideStatus: {
        type: 'object',
        properties: {
            guide_status_id: { type: 'string' },
            name: { type: 'string' },
            status: { type: 'boolean' },
        },
    },
    Guide: {
        type: 'object',
        properties: {
            guide_id: { type: 'string' },
            guide_number: { type: 'string' },
            sender_id: { type: 'string' },
            recipient_id: { type: 'string' },
            type: { type: 'string', enum: ['Shipping', 'Collection'] },
            priority: { type: 'string', enum: ['Immediate', 'Next Day'] },
            must_contain: { type: 'string' },
            custom_field1: { type: 'string' },
            custom_field2: { type: 'string' },
            custom_field3: { type: 'string' },
            custom_field4: { type: 'string' },
            declared_value: { type: 'number', format: 'double' },
            collection_value: { type: 'number', format: 'double' },
            freight_value: { type: 'number', format: 'double' },
            over_freight_value: { type: 'number', format: 'double' },
            total_value: { type: 'number', format: 'double' },
            width: { type: 'number', format: 'double' },
            weight: { type: 'number', format: 'double' },
            height: { type: 'number', format: 'double' },
            length: { type: 'number', format: 'double' },
            volumetric_weight: { type: 'number', format: 'double' },
            suggested_collection_date: { type: 'string', format: 'date-time' },
            guide_status_id: { type: 'string' },
            status: { type: 'boolean' },
            office_id: { type: 'string' },
            guide_type: { type: 'string', enum: ['Bond', 'Sticker'] },
        },
    },
    Sender: {
        type: 'object',
        properties: {
            sender_id: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            identification_type_id: { type: 'string' },
            identification: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address_id: { type: 'string' },
            status: { type: 'boolean' },
        },
    },
    Recipient: {
        type: 'object',
        properties: {
            recipient_id: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            identification_type_id: { type: 'string' },
            identification: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address_id: { type: 'string' },
            status: { type: 'boolean' },
        },
    },
};

module.exports = swaggerSchemas;