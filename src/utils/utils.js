
// exports.log = require('./console-log');


import {logError} from "./console-log";

exports.replacePlaceholder = function (string, placeholder, value) {
    return string.replace(new RegExp(`{\\[ ${placeholder} ]}`, 'g'), value);
};

exports.fillTemplate = function(templatePath, values){
    let template = '';

    fs.readFile(templatePath, 'utf-8', (err, data) => {
        if(err) logError(err);

        template = data;
        for(let placeholder in values){
            template = replacePlaceholder(template, placeholder, values[placeholder]);
        }

        fs.writeFile(templatePath, template, err => {
            if(err) logError(err);
        });
    });
};
