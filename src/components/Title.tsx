import { Box, Text } from "ink";
import { primaryColor } from "../functionGroups/common";
import OctoAvatar from "./OctoAvatar";

const Title = () => {
  return (
    <Box flexDirection="column" gap={1} marginBottom={1}>
      <Text>{primaryColor.bold.underline("Give task to your chat-llm")}</Text>
      <OctoAvatar />
    </Box>
  );
};

export default Title;
