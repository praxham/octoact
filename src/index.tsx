import { Box, render, useStdout } from "ink";
import { useState, useEffect } from "react";
import OllamaInstancePicker from "./components/OllamaInstancePicker";
import Title from "./components/Title";
import { userData } from "./user";
import ModelPicker from "./components/ModelPicker";
import OllamaChat from "./components/OllamaChat";

const App = () => {
  const { stdout } = useStdout();
  const [size, setSize] = useState({
    columns: stdout.columns,
    rows: stdout.rows,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({ columns: stdout.columns, rows: stdout.rows });
    };

    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  return (
    <Box
      flexDirection="column"
      height={size.rows - 1}
      justifyContent="flex-end"
    >
      <Box flexDirection="column">
        <Title />
        {!userData.pickedInstance && <OllamaInstancePicker />}
        {!userData.pickedModle && userData.pickedInstance && <ModelPicker />}
        {userData.selectedModelName && <OllamaChat />}
      </Box>
    </Box>
  );
};

export default App;

render(<App />);
