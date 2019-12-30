
// exports.log = require('./console-log');


exports.replacePlaceholder = function (string, placeholder, value) {
    return string.replace(new RegExp(`{\\[ ${placeholder} ]}`, 'g'), value);
};
