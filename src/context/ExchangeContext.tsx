import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface ExchangeRateData {
  rates: {
    [currency: string]: number;
  };
}

interface ExchangeRateProviderProps {
  children: ReactNode;
}

const ExchangeRateContext = createContext<ExchangeRateData | null>(null);

export const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({
  children,
}) => {
  const [exchangeRateData, setExchangeRateData] =
    useState<ExchangeRateData | null>(null);

  useEffect(() => {
    const fetchExchangeRateData = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const data: ExchangeRateData = await response.json();
        setExchangeRateData(data);
      } catch (error) {
        console.error('Error fetching exchange rate data:', error);
      }
    };

    fetchExchangeRateData();
  }, []);

  return (
    <ExchangeRateContext.Provider value={exchangeRateData || null}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => useContext(ExchangeRateContext);
