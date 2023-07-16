const moment = require('moment-business-days');

moment.updateLocale('co', { workingWeekdays: [1, 2, 3, 4, 5, 6] });

class DateTimeHelper {
    getCurrentDateTime() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const hh = String(today.getHours()).padStart(2, '0');
        const MM = String(today.getMinutes()).padStart(2, '0');

        return {
            date: `${yyyy}/${mm}/${dd}`,
            time: `${hh}:${MM}`,
        };
    }

    getNextBusinessDay(date) {
        const currentDate = moment(date, 'YYYY/MM/DD');
        const nextBusinessDay = currentDate.nextBusinessDay();
        return nextBusinessDay.format('YYYY/MM/DD')
    }

    getDateTime(date) {
        const new_date = new Date(date);
        const yyyy = new_date.getFullYear();
        const mm = String(new_date.getMonth() + 1).padStart(2, '0');
        const dd = String(new_date.getDate()).padStart(2, '0');
        const hh = String(new_date.getHours()).padStart(2, '0');
        const MM = String(new_date.getMinutes()).padStart(2, '0');


        return {
            date: `${yyyy}/${mm}/${dd}`,
            time: `${hh}:${MM}`,
        };
    }
}

module.exports = DateTimeHelper;
