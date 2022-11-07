const fsPromises = require('fs/promises');
const path = require('path');
const { stdin, stdout } = process;

const outFile = path.resolve(__dirname, 'output.txt');

(async () => {
  await fsPromises.writeFile(outFile, '', {
    encoding: 'utf8',
    flag: 'w',
  });

  stdout.write(
    'Hi! Please enter some text to add to the file. ' +
      'To exit the program, type "exit" on a new line or press Ctrl+C.\n\n'
  );

  stdin.on('data', async (data) => {
    let exit_string = data.toString().toLowerCase().trim();
    if (exit_string === 'exit') {
      process.exit();
    }

    await fsPromises.writeFile(outFile, data.toString(), {
      encoding: 'utf8',
      flag: 'a',
    });
  });

  process.on('exit', () => stdout.write('\nThank you! Good bye'));
  process.on('SIGINT', () => process.exit());
})();
