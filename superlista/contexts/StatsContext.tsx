import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StatsContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <StatsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsRefresh = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsRefresh must be used within a StatsProvider');
  }
  return context;
};
