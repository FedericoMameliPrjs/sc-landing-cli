import arg from 'arg';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--create': String, //create a copy of a default project
      '--from': String, //clone a landing from a branch
      '-c': '--create',
      '-f': '--from',

    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    create: args['--create'] ||'',
    from: args['--from'] || '',
    template: args._[0]
  };
}


export function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  console.log(options);
}

