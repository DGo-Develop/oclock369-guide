const GuideNumberStorage = require('./guideNumberStorage');

class GuideNumberGenerator {
    constructor(accountName, accountKey, tableName) {
        this.storage = new GuideNumberStorage(accountName, accountKey, tableName);
        this.initialize();
    }

    async initialize() {
        await this.storage.createTableIfNotExists();
    }

    async generateGuideNumber() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const date = `${dd}${mm}${yyyy}`; // Pendiente ajustar prefijo por ambiente productivo.

        let generatedGuidesToday = await this.storage.getGeneratedGuidesCountForDate(date);
        generatedGuidesToday += 1;
        await this.storage.updateGeneratedGuidesCountForDate(date, generatedGuidesToday);

        return `${date}${String(generatedGuidesToday).padStart(6, '0')}`;
    }
}

module.exports = GuideNumberGenerator;
