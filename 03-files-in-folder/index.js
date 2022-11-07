const fsPromises = require('fs/promises');
const path = require('path');

const dirPath = path.resolve(__dirname, './secret-folder');

(async () => {
  try {
    let files = await fsPromises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        let { name, ext } = path.parse(file.name);
        ext = ext.slice(1);
        let size = (await fsPromises.stat(path.resolve(dirPath, file.name)))
          .size;
        console.log(`${name} - ${ext} - ${size}b`);
      }
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }
})();
