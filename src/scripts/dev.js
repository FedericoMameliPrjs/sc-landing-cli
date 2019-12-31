//script that watches sass changes and serve the landing page
import fs from 'fs';
import path from 'path';
import liveServer from "live-server";
import sass from "node-sass";

import NodeEnv from "../utils/nodeEnv";
import handleAssetsRequests from "../live-server-middlewares/handleAssetsRequests";
import log from "../utils/console-log";
import execa from "execa";

//set environment to development
NodeEnv.set('development');

async function compileSass(options) {
  const outputFilePath = `${options.cssOutput}/dev.style.css`;

  //verifico se è presente il file compilato
  try{
    await fs.promises.access(outputFilePath);
  }
  catch (err) {
   //se non presente compilo file
    sass.render({
      file: options.cssEntry,
    }, (err, result) => {
      if(err) {
        log(err);
        return;
      }

      fs.writeFile(outputFilePath, result.css, 'utf-8', err => log(err));
    });
  }


  const args = [
    '-w',
    options.cssEntry,
    `${options.cssOutput}/dev.style.css`
  ];

  execa('node-sass', args, {
    cwd: process.cwd()
  });
}


//3. run in parallel sass watching and live server
export default function (options) {

  const liveServerParams = {
    host: '127.0.0.1',
    open: false,
    wait: 500,
    mount:[
      ['/', './public'],
      ['/success', './public/success'],
      [`/media/${options.thirdLevel}_${options.name}`, './dist']
    ]
  };

  Promise.all([compileSass(options)])
    .then(() => {
      liveServer.start(liveServerParams);
    });
}




