class SubStatusGuide {
    constructor({ sub_status_guide_id, sub_status_guide_external_id, name, status, status_guide_id }) {
        this.sub_status_guide_id = sub_status_guide_id;
        this.sub_status_guide_external_id = sub_status_guide_external_id;
        this.name = name;
        this.status = status;
        this.status_guide_id = status_guide_id;
    }

    toSafeObject() {
        return {
            sub_status_guide_id: this.sub_status_guide_id,
            sub_status_guide_external_id: this.sub_status_guide_external_id,
            name: this.name,
            status_guide_id: this.status_guide_id
        };
    }

    static fromDatabaseRow(row) {
        return new GuideStatus(row);
    }
}

module.exports = SubStatusGuide;
