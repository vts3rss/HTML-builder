const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');
const srcDir = path.resolve(__dirname, './assets');
const dstDir = path.resolve(__dirname, './project-dist/assets');

(async () => {
  await bundleStyles('style.css');
  await copyDir({ srcDir: srcDir, dstDir: dstDir });
  await buildPage();
  console.log('Successfully completed!');
})();

async function bundleStyles(outCssName) {
  const readDir = path.resolve(__dirname, './styles');
  try {
    const outDir = path.resolve(__dirname, 'project-dist');
    await fsPromises.mkdir(outDir, { recursive: true });
    let iterateCount = 1;
    let files = await fsPromises.readdir(readDir, { withFileTypes: true });

    for (let file of files) {
      let flag = file.isFile() && path.extname(file.name) === '.css';

      if (flag) {
        let inputStream = fs.createReadStream(
          path.resolve(readDir, file.name),
          { encoding: 'utf8' }
        );

        let mode = iterateCount === 1 ? 'w' : 'a';
        iterateCount++;

        const outputStream = fs.createWriteStream(
          path.resolve(outDir, outCssName),
          { encoding: 'utf8', flags: mode }
        );

        await pipeline(inputStream, outputStream);
      }
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }
}

async function copyDir({ srcDir, dstDir }) {
  try {
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

async function buildPage() {
  const outDir = path.resolve(__dirname, 'project-dist');
  await fsPromises.mkdir(outDir, { recursive: true });

  try {
    let inputFileData = await fsPromises.readFile(
      path.resolve(__dirname, 'template.html'),
      {
        encoding: 'utf8',
      }
    );

    let componentsDir = path.resolve(__dirname, 'components');
    let files = await fsPromises.readdir(componentsDir, {
      withFileTypes: true,
    });

    let dict = {};
    for (const file of files) {
      if (file.isFile()) {
        let { name, ext } = path.parse(file.name);
        if (ext === '.html') {
          dict[name] = await fsPromises.readFile(
            path.resolve(componentsDir, file.name),
            {
              encoding: 'utf8',
            }
          );
        }
      }
    }

    for (const [key, value] of Object.entries(dict)) {
      inputFileData = inputFileData.replaceAll(`{{${key}}}`, value);
    }

    let regex = /{{[^{}]*?}}/gim;
    inputFileData = inputFileData.replace(regex, '');
    regex = /[{}]/gim;
    inputFileData = inputFileData.replace(regex, '');

    await fsPromises.writeFile(
      path.resolve(outDir, 'index.html'),
      inputFileData,
      {
        encoding: 'utf8',
      }
    );
  } catch (error) {
    console.log('Error: ', error.message);
  }
}
