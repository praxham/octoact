import chalk from "chalk";
import path from "path";
export const primaryColor = chalk.hex("#99424A");
export const secondaryColor = chalk.hex("#999999");

export const updateFileWithContent = async (
  path: string,
  find: RegExp,
  newContent: string,
) => {
  const filePath = path;
  const file = Bun.file(filePath);
  const oldContent = await file.text();
  const updatedContent = oldContent.replace(find, newContent);
  await Bun.write(filePath, updatedContent);
};

export const startLoader = (message: string) => {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;

  const timer = setInterval(() => {
    // \r moves the cursor to the start of the line
    process.stdout.write(`\r${frames[i]} ${message}...`);
    i = (i + 1) % frames.length;
  }, 80);

  // Return a function to stop the loader
  return () => {
    clearInterval(timer);
    process.stdout.write("\r\x1b[K"); // Clears the line
  };
};

export const systemPrompt = `You are a professional coding assistant. Your mission is to provide high-quality code modifications or new files.

CRITICAL: Output ONLY valid JSON. No preamble. No markdown (no \`\`\`json). No text before or after the JSON object.

SCENARIO 1: If provided with CONTEXT FILES
You must compare the user's request against the context and identify the specific part of the code to change.
JSON Structure:
{
  "fileName": "name.ext",
  "previousCodeSnippet": "the exact original block of code being changed",
  "updatedCodeSnipped": "the new version of that specific block"
}

SCENARIO 2: If NO CONTEXT FILES are provided
You must generate a full file.
JSON Structure:
{
  "fileName": "name.ext",
  "code": "the full content of the new file"
}

General Rules:
1. Ensure all strings in the JSON are properly escaped (especially \", \n, and \\).
2. Never truncate code; provide the full snippet or file requested.
3. No comments or explanations outside the JSON.
4. If updating, "previousCodeSnippet" must match the original file content exactly to allow for a clean replacement.`;

export const fileMaker = async (data: { fileName: string; code: string }) => {
  try {
    await Bun.write(`./${data.fileName}`, data.code);
    console.log(`\n✅ File created: ${data.fileName}`);
  } catch (e) {
    console.error(`❌ Failed to create file: ${e}`);
  }
};

export const fileReader = async (filePath: string) => {
  try {
    const file = Bun.file(filePath);
    const fileContent = await file.text();
    const fileName = path.basename(filePath);
    const fileData = {
      name: fileName,
      content: fileContent,
    };
    return fileData;
  } catch (e) {
    console.error(`❌ Failed to read file ${filePath}: ${e}`);
  }
};

export const fileUpdater = async (
  filePath: string,
  findText: string,
  updateText: string,
) => {
  try {
    const file = Bun.file(filePath);

    const currentContent = await file.text();

    if (!currentContent.includes(findText)) {
      console.warn(
        `\n⚠️  Warning: Could not find the exact 'previousCodeSnippet' in ${filePath}. Replacement might fail.`,
      );
    }

    const updatedContent = currentContent.replace(findText, updateText);

    await Bun.write(filePath, updatedContent);

    console.log(`\n✅ File updated successfully: ${filePath}`);
    return true;
  } catch (e) {
    console.error(`\n❌ Failed to update file ${filePath}: ${e}`);
    return false;
  }
};
