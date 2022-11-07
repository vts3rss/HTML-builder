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
    const cssPath = path.resolve(outDir, outCssName);

    await fsPromises.writeFile(cssPath, '', {
      encoding: 'utf8',
      flag: 'w',
    });

    let files = await fsPromises.readdir(readDir, { withFileTypes: true });

    for (let file of files) {
      let flag = file.isFile() && path.extname(file.name) === '.css';

      if (flag) {
        let inputStream = fs.createReadStream(
          path.resolve(readDir, file.name),
          { encoding: 'utf8' }
        );

        for await (const chunk of inputStream) {
          await fsPromises.writeFile(cssPath, chunk.toString(), {
            encoding: 'utf8',
            flag: 'a',
          });
        }
        await fsPromises.writeFile(cssPath, '\n', {
          encoding: 'utf8',
          flag: 'a',
        });
      }
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }
}
