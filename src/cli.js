import path from 'path';
import minimist from 'minimist';
import minimistOptions from 'minimist-options';
import {
  create,
  runDev
  } from './index.js';
import {logError} from "./utils/console-log";

function parseArgs(rawArgs) {
  /*
  * COMANDS
  * + create
  *   [--from/-f, --name/-n]
  *
  * + dev
  *   [--output/-o, ]
  *
  * + build
  *   [--output/-o, ]
  * */
  const defaultLandingName = process.cwd().split(/\\/).reverse()[0];
  const defaultDistOutputFolder = path.resolve(process.cwd(), './dist');

  const argsOptions = minimistOptions({
    from: {
      type: 'string',
      alias: 'f',
      default: ''
    },
    name: {
      type: 'string',
      alias: 'n',
      default: defaultLandingName
    },
    cssEntry:{
      type: 'string',
      alias: 'ce',
      default: path.resolve(process.cwd(), './src/scss/main.scss')
    },
    cssOutput: {
      type: 'string',
      alias: 'co',
      default: defaultDistOutputFolder
    },
    imagesEntry:{
      type: 'string',
      // default: path.resolve(process.cwd(), './src/images')
      default: './src/images'
    },
    imagesOutput:{
      type: 'string',
      default: defaultDistOutputFolder
    },
    thirdLevel:{
      type: 'string',
      default: ''
    }
  });

  const args = minimist(rawArgs, argsOptions);

  const cmd = {
    $args_: [...args._],
    key: args._[0],
    get value(){

      let value = undefined;
      switch (this.key) {
        case 'create':
          !this.$args_[1]
            ? value = path.resolve(process.cwd(), './')
            : value = path.resolve(process.cwd(), this.$args_[1]);
          break;
      }

      return value;
    }
  };

  return {
    cmd,
    options:{
      name: args.name,
      from: args.from,
      cssEntry: args.cssEntry,
      cssOutput: args.cssOutput,
      thirdLevel: args.thirdLevel,
      images: {
        entryFolder: args.imagesEntry,
        outputFolder: args.imagesOutput
      }
    }
  };
}

export function cli (args) {
  const {cmd, options} = parseArgs(args);

  switch (cmd.key) {
    case 'create':
      create({
        projectPath: cmd.value,
        ...options
      })
        .catch(err => {
          logError(err);
        });
      break;
    case 'dev':
      runDev(options);
      break;
  }
}

