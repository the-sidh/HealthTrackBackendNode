const hbs = require('hbs');
const moment = require('moment');
const dateFormat = 'DD/MM/YYYY';

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('formatDate', (datetime) => {
    return moment(datetime).format(dateFormat);
});

hbs.registerHelper('selected', (option, value) => {
    if (option === value) {
        return ' selected';
    } else {
        return '';
    }
});

module.exports = { hbs };