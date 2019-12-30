const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const userData = require('../../data/user');
const log = require('./console-log');

exports.set = async function (username, password) {
  userData.username = username;
  userData.password = await bcrypt.hash(password, 10);

  save(userData);
};

exports.get = function (prop) {
  return prop ? userData[prop] : userData;
};

function save(data) {
  fs.writeFile(path.resolve(__dirname, '../data/user.json'), JSON.stringify(data), function (err) {
    if(err) log(err, 'error');
  });
}
