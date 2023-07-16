const Address = require('./address');

class Sender {
    constructor({ sender_id, first_name, last_name, identification_type_id, identification, phone, address, status, office_id, emails }) {
        this.sender_id = sender_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.identification_type_id = identification_type_id;
        this.identification = identification;
        this.phone = phone;
        this.office_id = office_id;
        if (address)
            this.address = new Address(address);
        this.status = status;
        this.emails = emails || [];
    }

    toSafeObject() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            identification_type_id: this.identification_type_id,
            identification: this.identification,
            phone: this.phone,
            office_id: this.office_id,
            address: new Address(this.address).toSafeObject(),
            emails: this.emails.map(email => email.toSafeObject())
        };
    }

    toDatabaserow() {
        return {
            sender_id: this.sender_id,
            first_name: this.first_name,
            last_name: this.last_name,
            identification_type_id: this.identification_type_id,
            identification: this.identification,
            phone: this.phone,
            office_id: this.office_id,
            address_id: this.address.address_id,
            status: this.status,
        };
    }

    static fromDatabaseRow(row, emails) {
        if (!row.sa_address_id)
            return new Sender({ ...row, emails, address: Address.fromDatabaseRow(null) });
        else {
            const address = new Address({
                address_id: row.sa_address_id,
                localized_street: row.sa_localized_street,
                city_id: row.sa_city_id,
                country_id: row.sa_country_id,
                longitude: row.ra_longitude,
                latitude: row.ra_latitude,
                department_id: row.sa_department_id,
                zone_id: row.sa_zone_id
            });
            return new Sender({ ...row, emails, address: address });
        }
    }
}

module.exports = Sender;