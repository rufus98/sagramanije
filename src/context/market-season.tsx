import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { getMarketDay, isMarketSeason } from '@/utils/mercatini';

const MarketDay = createContext('');

export function MarketSeasonProvider({ children }: { children: ReactNode }) {
  const [day, setDay] = useState(getMarketDay);
  useEffect(() => {
    const refresh = () => setDay(getMarketDay());
    const timer = setInterval(refresh, 60_000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  return <MarketDay.Provider value={day}>{children}</MarketDay.Provider>;
}

export function useMarketSeason() {
  const day = useContext(MarketDay);
  return { day, inSeason: isMarketSeason(day) };
}
