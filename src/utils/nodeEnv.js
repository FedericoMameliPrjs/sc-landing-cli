import log from "./console-log";

export default class NodeEnv{
  static set(value){
    if(typeof value !== 'string'){
      log(`Node Env error: value must be a string!\n ${typeof value} given.`, 'error');
      return;
    }

    process.env.NODE_ENV = value;
  }

  static get(){
    return process.env.NODE_ENV;
  }
}
