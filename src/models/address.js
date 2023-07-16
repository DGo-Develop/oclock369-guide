class Address {
    constructor({ address_id,
        street,
        city_id,
        department_id,
        country_id,
        zone_id,
        latitude,
        longitude,
        localized_street,
        country,
        city,
        zone,
        department, }) {
        this.address_id = address_id;
        this.street = street;
        this.city_id = city_id;
        this.country_id = country_id;
        this.department_id = department_id;
        this.zone_id = zone_id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.localized_street = localized_street;
        this.address_id = address_id;
        this.country = country;
        this.city = city;
        this.zone = zone;
        this.department = department;
    }

    toSafeObject() {
        return {
            address_id: this.address_id,
            street: this.street,
            city_id: this.city_id,
            department_id: this.department_id,
            country_id: this.country_id,
            zone_id: this.zone_id,
            latitude: this.latitude,
            longitude: this.longitude,
            localized_street: this.localized_street,
            country: this.country,
            city: this.city,
            zone: this.zone,
            department: this.department,
        };
    }

    static fromDatabaseRow(row) {
        if (!row) {
            return null;
        }

        return new Address(row);
    }
}

module.exports = Address;
