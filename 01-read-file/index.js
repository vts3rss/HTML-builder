const fs = require('fs');
const path = require('path');

const absPath = path.resolve(__dirname, 'text.txt');
const inputStream = fs.createReadStream(absPath, { encoding: 'utf8' });

inputStream.on('data', (chunk) => process.stdout.write(chunk));
inputStream.on('end', () => console.log());
inputStream.on('Error: ', (error) => console.log('Error: ', error.message));
