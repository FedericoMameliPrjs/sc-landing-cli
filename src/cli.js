import path from 'path';
import minimist from 'minimist';
import minimistOptions from 'minimist-options';

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

  const argsOptions = minimistOptions({
    from: {
      type: 'string',
      alias: 'f'
    },
    name: {
      type: 'string',
      alias: 'n',
      default: defaultLandingName
    },
    output: {
      type: 'string',
      alias: 'o',
      default: path.resolve(process.cwd(), './dist')
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
      from: args.from || '',
      output: args.output
    }
  };
}

export function cli (args) {
  const options = parseArgs(args);
  console.log(options);
}

