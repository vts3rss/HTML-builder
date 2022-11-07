const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  await bundleStyles('bundle.css');
  console.log('Successfully completed!');
})();

async function bundleStyles(outCssName) {
  const readDir = path.resolve(__dirname, './styles');
  try {
    const outDir = path.resolve(__dirname, 'project-dist');
    await fsPromises.mkdir(outDir, { recursive: true });
    const outputStream = fs.createWriteStream(
      path.resolve(outDir, outCssName),
      { encoding: 'utf8', flags: 'w' }
    );

    let files = await fsPromises.readdir(readDir, { withFileTypes: true });

    for (let file of files) {
      let flag = file.isFile() && path.extname(file.name) === '.css';

      if (flag) {
        let inputStream = fs.createReadStream(
          path.resolve(readDir, file.name),
          { encoding: 'utf8' }
        );

        for await (const chunk of inputStream) {
          outputStream.write(chunk.toString() + '\n');
        }
      }
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }
}
