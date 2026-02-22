import { Box, Text, useInput } from "ink";
import React, { useEffect, useState } from "react";
import {
  fileReader,
  primaryColor,
  secondaryColor,
  startLoader,
} from "../functionGroups/common";
import TextInput from "ink-text-input";
import { sendPrompt } from "../functionGroups/ollama";
import { userData } from "../user";

const OllamaChat = () => {
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [showFileRecommendations, setShowFileRecommendations] = useState(false);
  const [fileToSearchFor, setFileToSearchFor] = useState("");
  const [recommenedFiles, setRecommenedFiles] = useState<string[]>([]);
  const [filePaths, setFilePaths] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputKey, setInputKey] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const match = userPrompt.match(/@(\S+)/);

    if (match) {
      const fileQuery = match[1];
      if (fileQuery) setFileToSearchFor(fileQuery);
      // Perform the deep find search
      const { stdout, success } = Bun.spawnSync([
        "find",
        ".",
        "-name",
        "node_modules",
        "-prune",
        "-o",
        "-iname",
        `*${fileQuery}*`,
        "-print",
      ]);

      if (success) {
        const output = stdout.toString().trim();
        const files = output ? output.split("\n").slice(0, 4) : [];
        setRecommenedFiles(files);
        setShowFileRecommendations(true);
      }
    } else {
      setShowFileRecommendations(false);
    }
  }, [userPrompt]);

  useEffect(() => {
    if (userPrompt.includes("@")) {
      setShowFileRecommendations(true);
    } else {
      setShowFileRecommendations(false);
    }
  }, [userPrompt]);

  useInput((input, key) => {
    if (!showFileRecommendations) return;

    if (key.downArrow) {
      setSelectedIndex((prev) =>
        prev < recommenedFiles.length - 1 ? prev + 1 : prev,
      );
    }
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
    if (key.tab && showFileRecommendations) {
      // Logic to replace @filename with the selected path
      const selectedFile = recommenedFiles[selectedIndex];
      const selectedFileToShow = `@${selectedFile?.replace("./", "")}`;
      const newPrompt = userPrompt.replace(/@\S+/, `${selectedFileToShow} `);
      setFilePaths((prev) => [...prev, selectedFile]);
      setUserPrompt(newPrompt);
      setShowFileRecommendations(false);
      setInputKey((prev) => prev + 1);
    }
  });

  const handlePromptSubmit = async () => {
    if (!userPrompt) return;
    const currentMessage = userPrompt;
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: currentMessage },
    ]);
    const stop = startLoader(`${userData.selectedModelName} thinking`);
    let response;
    if (filePaths) {
      const filesData = await Promise.all(
        filePaths?.map(async (path) => {
          return await fileReader(path);
        }),
      );
      response = await sendPrompt(userPrompt, filesData);
    } else {
      response = await sendPrompt(userPrompt);
    }

    if (response) {
      stop();
      setChatHistory((prev) => [...prev, { role: "llm", content: response }]);
      setUserPrompt("");
      setFilePaths([]);
      setInputKey((prev) => prev + 1);
    } else {
      stop();
      stop();
      setChatHistory((prev) => [
        ...prev,
        { role: "llm", content: "❌ Error: Failed to get response." },
      ]);
    }
  };

  return (
    <Box flexDirection="column">
      <Box flexDirection="column">
        {chatHistory.map((msg, index) => (
          <Box key={index} flexDirection="column" marginTop={1}>
            <Box flexDirection="row" gap={1}>
              {msg.role === "user" ? (
                <Box
                  backgroundColor={"#999999"}
                  width={1}
                  height={1}
                  marginRight={1}
                />
              ) : (
                <Box
                  backgroundColor={"#99424A"}
                  width={1}
                  height={1}
                  marginRight={1}
                />
              )}
              <Text>{msg.content}</Text>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        flexDirection="row"
        borderStyle="single"
        borderColor="#999999"
        gap={1}
        paddingLeft={1}
        paddingRight={1}
      >
        <Box backgroundColor={"#999999"} width={1} height={1} marginRight={1} />
        <TextInput
          key={inputKey}
          showCursor={showCursor}
          placeholder="What file you want octo to make or change?"
          value={userPrompt}
          onChange={setUserPrompt}
          onSubmit={handlePromptSubmit}
        />
      </Box>
      {showFileRecommendations && fileToSearchFor && (
        <Box flexDirection="column" marginLeft={4} marginTop={1}>
          {recommenedFiles.map((file, index) => (
            <Text
              key={index}
              color={index === selectedIndex ? "#99424A" : "#999999"}
            >
              {index === selectedIndex ? " > " : "   "}
              {file}
            </Text>
          ))}
        </Box>
      )}
      {llmResponse && (
        <Box flexDirection="row" gap={1} marginTop={1}>
          <Box
            backgroundColor={"#99424A"}
            width={1}
            height={1}
            marginRight={1}
          />
          <Text>{llmResponse}</Text>
        </Box>
      )}
    </Box>
  );
};

export default OllamaChat;
