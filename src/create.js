import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import ora from 'ora';
import chalk from "chalk";
import prompts from 'prompts';
import execa from "execa";

import {log, logError} from './utils/console-log';
import repoUrls from './repo-urls';
import * as git from './utils/git';


//create the landing project
async function create(options) {

  const spinner = ora();
  const action = options.from ? 'clone' : 'create';
  const gitProjectUrl = repoUrls[action];

  //1. if folder not exists, create it,
  //   if exists and it is not empty, ask if override it, if so, override it.
  await handleProjectDir(options.projectPath);

  //2. clone git repo
  // spinner.start(chalk.cyan('Downloading...\n'));

  await git.clone(gitProjectUrl, options.projectPath, {
    branch: options.from || ''
  }).catch(err => logError(err));

  //3. run npm install to install dependencies
  // spinner.start(chalk.cyan('Installing...\n'));
  const r = await execa('npm', ['install'], {cwd: options.projectPath});

  if(r.failed)
    logError(r.stdout);

  // spinner.clear();
  log('project created!', 'success');
  process.exit();
}

function handleProjectDir(projectPath){
  return new Promise(async (resolve, reject) => {

    //1. check if the folder exists, if not create it
    try{
      await fs.promises.access(projectPath);
    }
    catch (err) {
      fs.mkdirSync(projectPath);
    }

    //2. if folder exists and is not empty, prompt if user wants to override it.
    // If yes delete its content, else exit
    const dirContent = fs.readdirSync(projectPath);

    if(dirContent.length) {
      const { answer } = await prompts({
        type: 'text',
        name: 'answer',
        message: 'output directory is not empty.\nDo you want to override it?',
        validate: val => ['yes', 'y', 'no', 'n'].includes(val)
      })
        .catch(err => reject(err));

      if(['yes', 'y'].includes(answer)){
        //2b. delete dir content
        dirContent.forEach(file => {
          rimraf.sync(path.join(projectPath, file));
        });
      }
    }

    resolve();
  });
}

export default create;
