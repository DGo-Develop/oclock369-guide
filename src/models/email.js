class Email {
    constructor({ email_id, email_address, email_type, owner_id }) {
        this.email_id = email_id;
        this.email_address = email_address;
        this.email_type = email_type;
        this.owner_id = owner_id;
    }

    toDatabaseRow() {
        return {
            email_id: this.email_id,
            email_address: this.email_address,
            email_type: this.email_type,
            owner_id: this.owner_id
        };
    }

    toSafeObject() {
        return {
            email_address: this.email_address
        };
    }

    static fromDatabaseRow(row) {
        return new Email({
            email_id: row.email_id,
            email_address: row.email_address,
            email_type: row.email_type,
            owner_id: row.owner_id
        });
    }
}

module.exports = Email;
