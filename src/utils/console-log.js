import chalk from'chalk';
import { isString } from'lodash/lang';

const log = function(message, type = null){
  const icon = {
    success: '✔',
    info: 'ℹ',
    error: '❌',
    warn: '⚠'
  };

  const chalkFn = {
    success: chalk.green,
    info: chalk.cyan,
    error: chalk.red,
    warn: chalk.yellow
  };

  if(type && isString(message))
    console.log(chalkFn[type](`${icon[type]} ${message}`));
  else
    console.log(message);
};

const logError = function (message, exitCode = 1){
  log(message, 'error');
  process.exit(exitCode);
};

export default log;
export {log, logError};
