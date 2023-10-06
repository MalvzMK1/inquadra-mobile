import React, { createContext, useContext, useState } from "react";

interface ComponentContextType {
  startsAt: string;
  setStartsAt: (value: string) => void;
  endsAt: string;
  setEndsAt: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
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

export const InComponentInputsProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [price, setPrice] = useState("");

  return (
    <ComponentContext.Provider
      value={{
        startsAt,
        setStartsAt,
        endsAt,
        setEndsAt,
        price,
        setPrice,
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};
