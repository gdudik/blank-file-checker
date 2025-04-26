const fs = require('fs');
const path = require('path');

// Get command line arguments
const [, , sourcePath, destinationPath] = process.argv;

if (!sourcePath || !destinationPath) {
  console.error('Usage: node copyfile.js <sourcePath> <destinationPath>');
  process.exit(1);
}

function getLineCount(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Split into lines
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    return lines.length;
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    return 0;
  }
}

function copyFile(source, destination) {
  try {
    // Read content and filter out lines starting with '-'
    const content = fs.readFileSync(source, 'utf8');
    const filteredLines = content
      .split(/\r?\n/)
      .filter(line => !line.trimStart().startsWith('-'))
      .join('\n');

    // Write filtered content to destination
    fs.writeFileSync(destination, filteredLines);
    console.log(`Copied ${source} to ${destination} (filtered)`);
  } catch (err) {
    console.error(`Error copying file: ${err.message}`);
  }
}

// Run every 5 seconds
setInterval(() => {
  if (!fs.existsSync(sourcePath)) {
    console.log(`Source file does not exist, skipping...`);
    return;
  }

  const lineCount = getLineCount(sourcePath);

  if (lineCount < 2) {
    console.log(`Source file has less than 2 lines (${lineCount} line(s)), skipping...`);
    return;
  }

  copyFile(sourcePath, destinationPath);
}, 5000);
