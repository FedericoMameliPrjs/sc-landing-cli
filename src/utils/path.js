import fs from "fs";

export function createDirIfNotExits(dir) {
  console.log({dir});
  return new Promise(async (resolve, reject) => {
    //1.verifico se il path esiste
    try{
      await fs.promises.access(dir);
      resolve();
      console.log('Directory Esiste!')
    }catch (err) {
      //2. Path non esistente, salgo di un livello e verifico se la directory padre esiste, se no : creo.
      // se path "." non faccio nulla
      console.log('Directory Non Esiste!')

      let parentDir = dir.split('/');
          parentDir.splice(parentDir.length-1, 1);
          parentDir = parentDir.join('/');

          console.log({parentDir});

          if(parentDir !== "./"){
            console.log('Verifico se esiste parentDir');
            await createDirIfNotExits(parentDir);
          }

            //create path
            const mkdirErr = fs.mkdirSync(dir);
            if(mkdirErr) reject(mkdirErr);
            resolve();
    }
  });

}
