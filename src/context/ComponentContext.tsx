// src/context/ComponentContext.tsx
import React, { createContext, useContext, useState } from "react";

interface ComponentContextType {
  addedComponents: JSX.Element[];
  setAddedComponents: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  dayUse: boolean;
  setDayUse: (dayUse: boolean) => void;
}

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined,
);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);

  if (!context) {
    throw new Error(
      "useComponentContext must be used within a ComponentProvider",
    );
  }
  return context;
};

export const ComponentProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [addedComponents, setAddedComponents] = useState<JSX.Element[]>([]);
  const [dayUse, setDayUse] = useState(false);

  return (
    <ComponentContext.Provider
      value={{
        addedComponents,
        setAddedComponents,
        dayUse,
        setDayUse,
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};
