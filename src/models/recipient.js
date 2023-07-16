const Address = require('./address');
const Email = require('./email');

class Recipient {
    constructor({ recipient_id, first_name, last_name, identification_type_id, identification, phone, address, status, emails }) {
        this.recipient_id = recipient_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.identification_type_id = identification_type_id;
        this.identification = identification;
        this.phone = phone;
        this.address = new Address(address);
        this.status = status;
        this.emails = emails || [];
    }

    toDatabaserow() {
        return {
            recipient_id: this.recipient_id,
            first_name: this.first_name,
            last_name: this.last_name,
            identification_type_id: this.identification_type_id,
            identification: this.identification,
            phone: this.phone,
            address_id: this.address.address_id,
            status: this.status
        };
    }

    toSafeObject() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            identification_type_id: this.identification_type_id,
            identification: this.identification,
            phone: this.phone,
            address: new Address(this.address).toSafeObject(),
            emails: this.emails.map(email => email.toSafeObject())
        };
    }

    static fromDatabaseRow(row, emails) {
        if (!row.ra_address_id)
            return new Recipient({ ...row, emails, address: Address.fromDatabaseRow(null) });
        else {
            const address = new Address({
                address_id: row.ra_address_id,
                localized_street: row.ra_localized_street,
                city_id: row.ra_city_id,
                country_id: row.ra_country_id,
                longitude: row.ra_longitude,
                latitude: row.ra_latitude,
                department_id: row.ra_department_id,
                zone_id: row.ra_zone_id                
            });
            return new Recipient({ ...row, emails, address: address });
        }
    }
}

module.exports = Recipient;
