class GuideStatus {
    constructor({ status_guide_id, name, status }) {
        this.status_guide_id = status_guide_id;
        this.name = name;
        this.status = status;
    }

    toSafeObject() {
        return {
            status_guide_id: this.status_guide_id,
            name: this.name
        };
    }

    static fromDatabaseRow(row) {
        return new GuideStatus(row);
    }
}

module.exports = GuideStatus;
