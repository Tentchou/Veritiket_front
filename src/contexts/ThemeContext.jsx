import React, { createContext, useContext, useState } from 'react';

// 1. On crée le pont de communication
const ThemeContext = createContext();

// 2. On crée le fournisseur (Provider) qui va envelopper notre application
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Sombre par défaut

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Un petit Hook personnalisé pour l'utiliser facilement partout
export const useTheme = () => useContext(ThemeContext);