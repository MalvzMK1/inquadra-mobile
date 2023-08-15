// src/context/ComponentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ComponentContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  addedComponents: JSX.Element[];
  setAddedComponents: (component: JSX.Element[]) => void;
  dayUseYes: boolean;
  setDayUseYes: (dayUse: boolean) => void;
  dayUseNo: boolean;
  setDayUseNo: (dayUse: boolean) => void;
};

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
  const [dayUseYes, setDayUseYes] = useState(false);
  const [dayUseNo, setDayUseNo] = useState(false);

  return (
    <ComponentContext.Provider value={{ inputValue, setInputValue, addedComponents, setAddedComponents, dayUseYes, setDayUseYes, dayUseNo, setDayUseNo }}>
      {children}
    </ComponentContext.Provider>
  );
};
