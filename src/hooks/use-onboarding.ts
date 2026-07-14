import { useSyncExternalStore } from 'react';

import { onboardingStorage } from '@/utils/onboarding-storage';

// store minimale fuori da React: il flag serve al root layout (per la guard)
// e allo screen di onboarding (per chiuderlo), senza montare un context
let seen = onboardingStorage.getSeen();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function completeOnboarding() {
  if (seen) return;
  seen = true;
  onboardingStorage.setSeen();
  listeners.forEach((listener) => listener());
}

export function useHasSeenOnboarding() {
  return useSyncExternalStore(subscribe, () => seen);
}
