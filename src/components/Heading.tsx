import { Box, Text } from "ink";
import { primaryColor } from "../functionGroups/common";
import OctoAvatar from "./OctoAvatar";
import { userData } from "../user";

const Heading = () => {
  const setupMode = !userData.pickedInstance || !userData.pickedModle;
  const commands = ["@: to add files"];
  return (
    <Box
      flexDirection="row"
      gap={1}
      justifyContent="space-between"
      marginBottom={1}
    >
      <Box flexDirection="column" gap={1}>
        <Text>
          {primaryColor.bold.underline(
            setupMode ? "Setup Octoact" : "Ask octo to act",
          )}
        </Text>
        <OctoAvatar />
      </Box>
      <Box width="50%" flexDirection="column" gap={1} alignItems="flex-start">
        <Text>Commands to run</Text>
        {commands.map((item) => (
          <Text>{item}</Text>
        ))}
      </Box>
    </Box>
  );
};

export default Heading;
