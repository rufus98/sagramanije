import type { Sagra } from '@/types/sagra';

const italianDay = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
});

export function getMarketDay(now = new Date()) {
  const preview = __DEV__ && process.env.EXPO_PUBLIC_MERCATINI_PREVIEW_DATE;
  if (preview && /^\d{4}-\d{2}-\d{2}$/.test(preview)) return preview;
  return italianDay.format(now);
}

export function isMarketSeason(day: string) {
  const monthDay = day.slice(5);
  return monthDay >= '11-20' || monthDay <= '01-20';
}

const marketType = /^mercatin[oi](?: (?:di )?natale| natalizio?)?$/i;
const marketTitle = /^(?:(?:il|i)\s+)?mercatin[oi]\s+(?:di\s+natale|natalizio?|dell[’']avvento)\b/i;

export function isMarket(event: Pick<Sagra, 'tipo' | 'category' | 'nome_sagra'>) {
  const type = event.tipo?.trim();
  if (type) return marketType.test(type.replace(/[_-]+/g, ' '));
  return marketType.test(event.category.trim()) || marketTitle.test(event.nome_sagra.trim());
}

export function marketPlace(market: Sagra) {
  const town = [market.citta, market.provincia].filter(Boolean).join(', ');
  return [market.indirizzo, town].filter(Boolean).join(' · ');
}

export function searchMarkets(markets: Sagra[], search: string) {
  const query = search.trim().toLocaleLowerCase('it');
  return markets.filter(market => isMarket(market) &&
    [market.nome_sagra, market.citta, market.provincia, market.indirizzo]
      .join(' ').toLocaleLowerCase('it').includes(query)
  );
}
