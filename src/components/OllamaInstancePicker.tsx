import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { secondaryColor } from "../functionGroups/common";
import { useState } from "react";
import { updateOllamaUrl } from "../functionGroups/ollama";

const OllamaInstancePicker = () => {
  const [errorMessage, setErrorMessage] = useState("");
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
      const success = await updateOllamaUrl(""); // "" will use local default
      if (!success) {
        setErrorMessage(
          "Could not connect to local Ollama. Make sure it's running.",
        );
      }
    } else if (ollamaConfig.choice === 2) {
      setOllamaConfig((prev) => ({ ...prev, step: "url" }));
    }
  };

  const handleUrlSubmit = async () => {
    if (ollamaConfig.customOllamaUrl) {
      setErrorMessage(""); // clear previous errors
      const success = await updateOllamaUrl(ollamaConfig.customOllamaUrl);

      if (!success) {
        setErrorMessage(
          `Failed to get models from ${ollamaConfig.customOllamaUrl}. Please check the URL and try again.`,
        );
      }
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
            <TextInput
              placeholder="https://ollama.self-hosted.com"
              value={ollamaConfig.customOllamaUrl}
              onChange={(value) =>
                setOllamaConfig((prev) => ({ ...prev, customOllamaUrl: value }))
              }
              onSubmit={handleUrlSubmit}
            />
          </Box>
        </Box>
      )}

      {errorMessage && (
        <Box marginTop={1}>
          <Text color="red">{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
};

export default OllamaInstancePicker;
