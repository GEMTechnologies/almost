import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OpportunityData {
  id: string;
  title: string;
  description: string;
  country: string;
  sector: string;
  amountMin: number;
  amountMax: number;
  currency: string;
  deadline: string;
  sourceUrl: string;
  sourceName: string;
  isVerified: boolean;
  requirements?: string[];
  eligibility?: string[];
  funderPriorities?: string[];
  applicationFormat?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  fundingType?: string;
  tags?: string[];
}

interface OpportunityContextType {
  selectedOpportunity: OpportunityData | null;
  isFromDiscovery: boolean;
  setSelectedOpportunity: (opportunity: OpportunityData | null) => void;
  setIsFromDiscovery: (isFrom: boolean) => void;
  clearOpportunity: () => void;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const useOpportunity = () => {
  const context = useContext(OpportunityContext);
  if (context === undefined) {
    throw new Error('useOpportunity must be used within an OpportunityProvider');
  }
  return context;
};

interface OpportunityProviderProps {
  children: ReactNode;
}

export const OpportunityProvider: React.FC<OpportunityProviderProps> = ({ children }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityData | null>(null);
  const [isFromDiscovery, setIsFromDiscovery] = useState(false);

  const clearOpportunity = () => {
    setSelectedOpportunity(null);
    setIsFromDiscovery(false);
  };

  return (
    <OpportunityContext.Provider
      value={{
        selectedOpportunity,
        isFromDiscovery,
        setSelectedOpportunity,
        setIsFromDiscovery,
        clearOpportunity,
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
};