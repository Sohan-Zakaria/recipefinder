import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const theme = useTheme();
  const favorites = useFavorites();

  return (
    <AppContext.Provider value={{ ...theme, ...favorites }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
