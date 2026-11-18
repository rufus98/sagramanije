import { useQuery } from '@tanstack/react-query';
import { sagraService } from '@/services/sagra.service';

type Position = { lat: number; lng: number } | null;

export function useNearbyEvents(location: Position, radiusKm = -1) {
  const lat = location?.lat ?? null;
  const lng = location?.lng ?? null;
  const radius = location && radiusKm > 0 ? radiusKm : undefined;
  return useQuery({
    queryKey: ['sagre', 'vicine', lat, lng, radius ?? null],
    queryFn: ({ signal }) => sagraService.getNearbySagre({ lat, lng, raggioKm: radius }, signal),
    staleTime: 60_000,
    retry: false,
  });
}
