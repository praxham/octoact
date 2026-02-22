import { Box } from "ink";

const OctoAvatar = () => {
  return (
    <Box flexDirection="row">
      {/* tentacles */}
      <Box flexDirection="column" gap={1} marginTop="auto">
        <Box backgroundColor={"#99424A"} width={4} height={1} />
        <Box backgroundColor={"#99424A"} width={4} height={1} />
      </Box>
      {/* body */}
      <Box backgroundColor={"#99424A"} width={10} height={4}>
        {/* eyes */}
        <Box
          backgroundColor={"black"}
          width={1}
          height={1}
          marginTop="auto"
          marginBottom={1}
          marginLeft={2}
        ></Box>
        <Box
          backgroundColor={"black"}
          width={1}
          height={1}
          marginTop="auto"
          marginLeft="auto"
          marginBottom={1}
          marginRight={2}
        ></Box>
      </Box>
      {/* tentacles */}
      <Box flexDirection="column" gap={1} marginTop="auto">
        <Box backgroundColor={"#99424A"} width={4} height={1} />
        <Box backgroundColor={"#99424A"} width={4} height={1} />
      </Box>
    </Box>
  );
};

export default OctoAvatar;
