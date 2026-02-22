import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import {
  secondaryColor,
  updateFileWithContent,
} from "../functionGroups/common";
import { getModels } from "../functionGroups/ollama";

const ModelPicker = () => {
  const [models, setModels] = useState<{ name: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchModels = async () => {
    const data = await getModels();
    setModels(data);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Keyboard Navigation Logic
  useInput((_, key) => {
    if (key.upArrow) {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : models.length - 1));
    }

    if (key.downArrow) {
      setActiveIndex((prev) => (prev < models.length - 1 ? prev + 1 : 0));
    }

    if (key.return) {
      handleSelection();
    }
  });

  const handleSelection = async () => {
    const chosenModelName = models[activeIndex]?.name;
    if (chosenModelName) {
      await updateFileWithContent(
        "./src/user.ts",
        /selectedModelName: ".*",/,
        `selectedModelName: "${chosenModelName}",`,
      );
      await updateFileWithContent(
        "./src/user.ts",
        /pickedModle: (true|false),/,
        "pickedModle: true,",
      );
    }
  };

  return (
    <Box flexDirection="column">
      <Text>{secondaryColor("Choose your model (Use ↑/↓ and Enter):")}</Text>

      {models.map((model, index) => {
        const isSelected = index === activeIndex;
        return (
          <Box key={model.name}>
            {/* Visual Indicator (Radio Button style) */}
            <Text color={isSelected ? "cyan" : "white"}>
              {isSelected ? "◉ " : "◯ "}
              {model.name}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default ModelPicker;
