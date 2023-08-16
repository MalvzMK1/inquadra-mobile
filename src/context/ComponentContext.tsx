// src/context/ComponentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ComponentContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  addedComponents: JSX.Element[];
  setAddedComponents: (component: JSX.Element[]) => void;
  dayUse: boolean;
  setDayUse: (dayUse: boolean) => void;
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);

  if (!context) {
    throw new Error('useComponentContext must be used within a ComponentProvider');
  }
  return context;
};

export const ComponentProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [addedComponents, setAddedComponents] = useState<JSX.Element[]>([]);
  const [dayUse, setDayUse] = useState(false);

  return (
    <ComponentContext.Provider value={{ inputValue, setInputValue, addedComponents, setAddedComponents, dayUse, setDayUse }}>
      {children}
    </ComponentContext.Provider>
  );
};
