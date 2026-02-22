import {
  fileMaker,
  fileUpdater,
  systemPrompt,
  updateFileWithContent,
} from "./common";
import { userData } from "../user";

export const getBaseURL = () =>
  userData.ollamaExternal || "http://localhost:11434/api";

export const updateOllamaUrl = async (url: string) => {
  const validationUrl = url || "http://localhost:11434/api";
  try {
    const tagsResponse = await fetch(`${validationUrl}/tags`);
    const data = await tagsResponse.json();

    if (!data?.models || !Array.isArray(data.models)) {
      throw new Error(
        "Invalid response from Ollama. Check your URL configuration.",
      );
    }

    await updateFileWithContent(
      "./src/user.ts",
      /ollamaExternal: ".*",/,
      `ollamaExternal: "${url}",`,
    );

    await updateFileWithContent(
      "./src/user.ts",
      /pickedInstance: (true|false),/,
      "pickedInstance: true,",
    );

    userData.ollamaExternal = url;
    userData.pickedInstance = true;

    return true;
  } catch (e) {
    console.error(`\n❌ Could not connect to Ollama at ${validationUrl}:`, e);
    return false;
  }
};

export const getModels = async () => {
  try {
    const tagsResponse = await fetch(getBaseURL() + "/tags");
    const data = await tagsResponse.json();

    if (!data?.models || !Array.isArray(data.models)) {
      throw new Error(
        "Invalid response from Ollama. Check your URL configuration.",
      );
    }

    return data.models;
  } catch (e) {
    console.error("Something Went Wrong:", e);

    // Reset user data and update src/user.ts
    userData.ollamaExternal = "";
    userData.pickedInstance = false;

    await updateFileWithContent(
      "./src/user.ts",
      /ollamaExternal: ".*",/,
      'ollamaExternal: "",',
    );

    await updateFileWithContent(
      "./src/user.ts",
      /pickedInstance: (true|false),/,
      "pickedInstance: false,",
    );

    return null;
  }
};

export const sendPrompt = async (
  prompt: string,
  filesData?: {
    name: string;
    content: string;
    path: string;
  }[],
) => {
  // 1. Convert your array of file objects into a single string block
  const formattedContext = filesData
    ?.map((f) => `FILE: ${f.name}\nCONTENT:\n${f.content}\n---`)
    .join("\n");

  // 2. Combine it with the prompt
  const promptWithFiles = `CONTEXT FILES:\n${formattedContext}\n\nUSER REQUEST: ${prompt}`;
  const hasFiles = filesData && filesData.length > 0;
  const data = {
    model: userData.selectedModelName,
    system: systemPrompt,
    prompt: hasFiles ? promptWithFiles : prompt,
    format: hasFiles
      ? {
          type: "object",
          properties: {
            fileName: { type: "string" },
            previousCodeSnippet: { type: "string" },
            updatedCodeSnipped: { type: "string" },
          },
          required: ["fileName", "previousCodeSnippet", "updatedCodeSnipped"],
        }
      : {
          type: "object",
          properties: {
            fileName: { type: "string" },
            code: { type: "string" },
          },
          required: ["fileName", "code"],
        },
    stream: false,
  };
  try {
    const response = await fetch(getBaseURL() + "/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Ollama Error (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    const parsedRes = JSON.parse(result?.response);
    if (hasFiles) {
      const originalFile = filesData.find((f) => f.name === parsedRes.fileName);
      const targetPath = originalFile
        ? originalFile.path
        : `./${parsedRes.fileName}`;

      await fileUpdater(
        targetPath,
        parsedRes.previousCodeSnippet,
        parsedRes.updatedCodeSnipped,
      );
    } else {
      await fileMaker(parsedRes);
    }
    return result?.response;
  } catch (e) {
    console.error("Failed to send prompt:", e);
    return null;
  }
};
