import WMMiniSimulator from "./wm-mini";

export const simulatorRegistry: Record<string, React.ComponentType> = {
  "wm-mini": WMMiniSimulator,
};
