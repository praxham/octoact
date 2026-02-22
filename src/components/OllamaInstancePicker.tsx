import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import {
  secondaryColor,
  updateFileWithContent,
} from "../functionGroups/common";
import { useState } from "react";

const OllamaInstancePicker = () => {
  const [ollamaConfig, setOllamaConfig] = useState<{
    choice: 1 | 2 | null;
    customOllamaUrl: string;
    step: "choice" | "url";
  }>({
    choice: null,
    customOllamaUrl: "",
    step: "choice",
  });

  const handleChoiceSubmit = async () => {
    if (ollamaConfig.choice === 1) {
      await updateFileWithContent(
        "./src/user.ts",
        /pickedInstance: (true|false),/,
        "pickedInstance: true,",
      );
    } else if (ollamaConfig.choice === 2) {
      setOllamaConfig((prev) => ({ ...prev, step: "url" }));
    }
  };

  const handleUrlSubmit = async () => {
    if (ollamaConfig.customOllamaUrl) {
      await updateFileWithContent(
        "./src/user.ts",
        /ollamaExternal: ".*",/,
        `ollamaExternal: "${ollamaConfig.customOllamaUrl}",`,
      );
      await updateFileWithContent(
        "./src/user.ts",
        /pickedInstance: (true|false),/,
        "pickedInstance: true,",
      );
    }
  };

  return (
    <Box flexDirection="column">
      {/* STEP 1: CHOICE */}
      {ollamaConfig.step === "choice" && (
        <Box flexDirection="column">
          <Text>{secondaryColor("Choose your ollama:")}</Text>
          <Text>1. local (Recommended)</Text>
          <Text>2. hosted</Text>
          <Box marginTop={1}>
            <Text>Enter your choice (1 or 2): </Text>
            <TextInput
              value={ollamaConfig.choice?.toString() ?? ""}
              onChange={(value) => {
                const num = parseInt(value, 10);
                setOllamaConfig((prev) => ({
                  ...prev,
                  choice: num === 1 || num === 2 ? (num as 1 | 2) : null,
                }));
              }}
              onSubmit={handleChoiceSubmit}
            />
          </Box>
        </Box>
      )}

      {/* STEP 2: URL (Only shows after choice 2 is submitted) */}
      {ollamaConfig.step === "url" && (
        <Box marginTop={1} flexDirection="column">
          <Text>
            {secondaryColor("Enter URL to your hosted OLLAMA instance:")}
          </Text>
          <Box>
            <Text>URL: </Text>
            <TextInput
              value={ollamaConfig.customOllamaUrl}
              onChange={(value) =>
                setOllamaConfig((prev) => ({ ...prev, customOllamaUrl: value }))
              }
              onSubmit={handleUrlSubmit}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OllamaInstancePicker;
