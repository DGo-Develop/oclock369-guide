
class DeliveryAttempt {
    constructor({ delivery_attempt_id, guide_id, date, observation, delivery_status, non_delivery_reason_id, non_collection_reason_id, truck_id }) {
        this.delivery_attempt_id = delivery_attempt_id;
        this.guide_id = guide_id;
        this.date = date;
        this.observation = observation;
        this.delivery_status = delivery_status;
        this.non_delivery_reason_id = non_delivery_reason_id;
        this.non_collection_reason_id = non_collection_reason_id;
        this.truck_id = truck_id;
    }

    static toSafeObject() {
        return {
            delivery_attempt_id: this.delivery_attempt_id,
            guide_id: this.guide_id,
            date: this.date,
            observation: this.observation,
            delivery_status: this.delivery_status,
            non_delivery_reason_id: this.non_delivery_reason_id,
            non_collection_reason_id: this.non_collection_reason_id,
            truck_id: this.truck_id,
        };
    }

    static fromDatabaseRow(row) {
        return new DeliveryAttempt(row);
    }
}

module.exports = DeliveryAttempt;
