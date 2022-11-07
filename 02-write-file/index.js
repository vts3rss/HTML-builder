const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const outputStream = fs.createWriteStream(
  path.resolve(__dirname, 'output.txt'),
  {
    encoding: 'utf8',
  }
);

stdout.write(
  'Hi! Please enter some text to add to the file. ' +
    'To exit the program, type "exit" on a new line or press Ctrl+C.\n\n'
);

stdin.on('data', (data) => {
  let exit_string = data.toString().toLowerCase().trim();
  if (exit_string === 'exit') {
    process.exit();
  }
  outputStream.write(data);
});

process.on('exit', () => stdout.write('\nThank you! Good bye'));
process.on('SIGINT', () => process.exit());

outputStream.on('Error: ', (error) => console.log('Error: ', error.message));
