import execa from "execa";

export const clone = async function (repo, to, options) {
  const args = ['clone', repo, './'];

  if(options.branch)
    args.splice(1, 0, `-b ${options.branch}`);

  try{
    return await execa('git', args, {
      cwd: to
    });
  }
  catch(err){
   return Promise.reject(err);
  }
};
