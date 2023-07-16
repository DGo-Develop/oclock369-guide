const axios = require('axios');
const Logger = require('../utils/logger');

class BeetrackService {
    constructor() {
        this.logger = new Logger('sub-status-guide-service');
    }

    async fetchSubStatuses() {
        this.logger.info('Fetching sub statuses from external API');
        const response = await axios.get(`${process.env.BEETRACK_URL}/sub_statuses`, {
            headers: {
                'X-AUTH-TOKEN': process.env.BEETRACK_KEY,
            }
        });

        if (response.status === 200) {
            return response.data.response.sub_statuses;
        } else {
            this.logger.error('Error in response from external API');
            return null;
        }
    }
}

module.exports = new BeetrackService();
