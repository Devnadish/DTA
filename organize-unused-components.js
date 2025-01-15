const fs = require("fs");

// Read the ts-prune output from a file or directly from the command
const inputFile = "unused-exports.txt"; // Change this if your input is different
const outputFile = "unused-components.txt";

// Read the input file
const data = fs.readFileSync(inputFile, "utf-8");

// Split the data into lines
const lines = data.split("\n");

// Create a map to group component exports by file
const groupedComponents = {};

// Process each line
lines.forEach((line) => {
  if (line.trim() === "") return; // Skip empty lines

  // Extract the file path and export details
  const [filePath, exportDetails] = line.split(" - ");
  if (!filePath || !exportDetails) return;

  // Focus only on .tsx and .jsx files (likely components)
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) return;

  // Initialize the file group if it doesn't exist
  if (!groupedComponents[filePath]) {
    groupedComponents[filePath] = [];
  }

  // Add the export to the file group
  groupedComponents[filePath].push(exportDetails);
});

// Generate the organized output
let organizedOutput = "=== Unused Components ===\n\n";
organizedOutput += `Last run: ${new Date().toISOString()}\n\n`;

// Sort files alphabetically
const sortedFiles = Object.keys(groupedComponents).sort();
for (const filePath of sortedFiles) {
  const exports = groupedComponents[filePath];
  organizedOutput += `--- ${filePath} ---\n`;
  exports.forEach((exp) => {
    organizedOutput += `${exp}\n`;
  });
  organizedOutput += "\n";
}

// Write the organized output to a file
fs.writeFileSync(outputFile, organizedOutput);

console.log(`Unused components written to ${outputFile}`);
