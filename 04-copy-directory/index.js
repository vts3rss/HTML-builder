const fsPromises = require('fs/promises');
const path = require('path');

const srcDir = path.resolve(__dirname, './files');
const dstDir = path.resolve(__dirname, './files-copy');

(async () => {
  await copyDir({ srcDir: srcDir, dstDir: dstDir });
  console.log('Successfully completed!');
})();

async function copyDir({ srcDir, dstDir }) {
  try {
    // console.log(dstDir);
    await fsPromises.rm(dstDir, { force: true, recursive: true });
    await fsPromises.mkdir(dstDir, { recursive: true });

    let files = await fsPromises.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      let srcPath = path.resolve(srcDir, file.name);
      let dstPath = path.resolve(dstDir, file.name);

      if (file.isDirectory()) {
        await copyDir({ srcDir: srcPath, dstDir: dstPath });
      } else if (file.isFile()) {
        await fsPromises.copyFile(srcPath, dstPath);
      }
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }
}
