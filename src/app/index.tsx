import { Redirect } from 'expo-router';
import { useMarketSeason } from '@/context/market-season';

export default function Home() {
  const { inSeason } = useMarketSeason();
  return <Redirect href={inSeason ? '/mercatini' : '/sagre'} />;
}
