const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const Logger = require('../utils/logger');

class GuideNumberStorage {
    constructor(accountName, accountKey, tableName) {
        const tablesUrl = `https://${accountName}.table.core.windows.net`;
        const credential = new AzureNamedKeyCredential(accountName, accountKey);
        this.tableClient = new TableClient(tablesUrl, tableName, credential);
        this.logger = new Logger('guide-number-storage');
    }

    async createTableIfNotExists() {
        this.logger.info('Checking if table exists in Azure Table Storage');
        try {
            await this.tableClient.createTable();
            this.logger.info('Table created successfully');
        } catch (error) {
            if (error.statusCode === 409 && error.code === 'TableAlreadyExists') {
                this.logger.info('Table already exists');
            } else {
                throw error;
            }
        }
    }

    async getGeneratedGuidesCountForDate(date) {
        this.logger.info('Retrieving generated guides count for date');
        const partitionKey = date;
        const query = this.tableClient.listEntities({
            queryOptions: {
                filter: `PartitionKey eq '${partitionKey}'`
            }
        });

        let generatedGuidesToday = 0;
        for await (const entity of query) {
            generatedGuidesToday = entity.guidesCount;
        }
        return generatedGuidesToday;
    }

    async updateGeneratedGuidesCountForDate(date, newCount) {
        this.logger.info('Updating generated guides count for date');
        const partitionKey = date;
        const rowKey = 'generatedGuidesCount';
        const entity = {
            partitionKey: partitionKey,
            rowKey: rowKey,
            guidesCount: newCount
        };

        try {
            // Intentar obtener la entidad primero
            await this.tableClient.getEntity(partitionKey, rowKey);

            // Si la entidad existe, actualizarla
            await this.tableClient.updateEntity(entity, "Merge");
        } catch (error) {
            if (error.statusCode === 404) {
                // Si la entidad no existe, crearla
                await this.tableClient.createEntity({
                    partitionKey: partitionKey,
                    rowKey: rowKey,
                    guidesCount: newCount
                });
            } else {
                this.logger.error(`Error during upsertEntity: ${error}`);
                throw error;
            }
        }
    }
}

module.exports = GuideNumberStorage;
