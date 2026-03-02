import React, { createContext, useContext, useState } from "react";

type ExecutionMode = "sim" | "live";

interface ExecutionModeContextType {
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;
  isLive: boolean;
}

const ExecutionModeContext = createContext<ExecutionModeContextType | undefined>(undefined);

export const ExecutionModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ExecutionMode>("sim");

  return (
    <ExecutionModeContext.Provider value={{ mode, setMode, isLive: mode === "live" }}>
      {children}
    </ExecutionModeContext.Provider>
  );
};

export const useExecutionMode = () => {
  const context = useContext(ExecutionModeContext);
  if (!context) throw new Error("useExecutionMode must be used within ExecutionModeProvider");
  return context;
};
