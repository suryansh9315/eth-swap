'use client'
import { useState, useEffect, useContext, createContext } from "react";

const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [blurScreen, setBlurScreen] = useState(false);

  return (
    <MainContext.Provider value={{ blurScreen, setBlurScreen }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
