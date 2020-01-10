//script that watches sass changes and serve the landing page
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import liveServer from "live-server";
import sass from "node-sass";

import NodeEnv from "../utils/nodeEnv";
import handleAssetsRequests from "../live-server-middlewares/handleAssetsRequests";
import log, {logError} from "../utils/console-log";
import execa from "execa";

//set environment to development
NodeEnv.set('development');

//1. Check for images anc optimize it
async function optimizeImages(options){
  /*{
    ....
    images: {
      entryFolder: ''
      outputFolder: ''
    }
  }*/
  const imgFileReg = /(.jpeg)|(.jpg)|(.png)$/;
  const readdir = promisify(fs.readdir);

  const resolvedPaths = {
    entry: path.resolve(process.cwd(), options.images.entryFolder),
    output: path.resolve(process.cwd(), options.images.outputFolder),
  };

  const entryFiles = readdir(resolvedPaths.entry);
  const distFiles = readdir(resolvedPaths.output);

  const filesLists = await Promise.all([entryFiles, distFiles]);
  //filesLists[0] = entryFiles; filesLists[1] = outputFiles

  //remove all file that are not images files from dist list
  filesLists[1] = filesLists[1].filter(file => file.match(imgFileReg));

  //check for diffs
  filesLists[0] = filesLists[0].reduce((arr, el) => {
    if(!filesLists[1].includes(el))
      arr.push(`${options.images.entryFolder}/${el}`);
    return arr;
  }, []);

  //optimize images if there are new,
  if(filesLists[0].length){
    await imagemin(filesLists[0], {
      destination: options.images.outputFolder,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

  }
}

//2. compile sass
async function compileSass(options) {
  /*
  options = {
    ...,
    css: {
      entry: './src/scss/main.scss'
      outputFolder: './dist',
    }
  }
  * */
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
        logError(err);
        return;
      }

      fs.writeFile(outputFilePath, result.css, 'utf-8', err => log(err));
    });
  }


  const args = [
    '-w',
    options.cssEntry,
    outputFilePath
  ];

  execa('node-sass', args, {
    cwd: process.cwd()
  });
}


export default async function (options) {

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

  await Promise.all([optimizeImages(options), compileSass(options)])
    liveServer.start(liveServerParams);



}




