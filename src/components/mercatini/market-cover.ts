const covers = [
  require('@/assets/images/mercatini/bancarelle-al-tramonto.png'),
  require('@/assets/images/mercatini/piazza-delle-lanterne.png'),
  require('@/assets/images/mercatini/abete-sulla-neve.png'),
];

export function marketCover(id: number): number {
  return covers[id % covers.length];
}
