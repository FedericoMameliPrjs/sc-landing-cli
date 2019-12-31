import execa from "execa";

export const clone = async function (repo, to, options) {
  to = to.split(/\\/);
  const folder = to.splice(to.length - 1, 1);
  const args = ['clone', repo, `./${folder}`];

  // if(options.branch)
    // args.splice(1, 0, `-b ${options.branch}`);

  try{
    return await execa('git', args, {
      cwd: to.join('\\')
    });
  }
  catch(err){
   return Promise.reject(err);
  }
};
