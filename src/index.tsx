import { Box, render } from "ink";
import OllamaInstancePicker from "./components/OllamaInstancePicker";
import Title from "./components/Title";
import { userData } from "./user";
import ModelPicker from "./components/ModelPicker";
import OllamaChat from "./components/OllamaChat";
import { TerminalInfoProvider } from "ink-picture";

const App = () => {
  return (
    <TerminalInfoProvider>
      <Box flexDirection="column">
        <Title />
        {!userData.pickedInstance && <OllamaInstancePicker />}
        {!userData.pickedModle && <ModelPicker />}
        {userData.selectedModelName && <OllamaChat />}
      </Box>
    </TerminalInfoProvider>
  );
};

export default App;

render(<App />);
