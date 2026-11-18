import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

const headerBulbs = [[14, 8, 12], [47, 12, 5], [84, 13, -4], [121, 12, 7], [157, 8, -11]];
const listBulbs = [[24, 12, 12], [70, 10, -9]];

export function MarketLights({ pair = false }: { pair?: boolean }) {
  const bulbs = pair ? listBulbs : headerBulbs;
  return (
    <Svg width={pair ? 100 : 132} height={pair ? 44 : 33}
      viewBox={pair ? '0 0 100 44' : '0 0 176 44'} accessible={false} pointerEvents="none">
      <Path d={pair ? 'M-3 5 Q45 23 102 2' : 'M0 5 Q88 22 176 5'} stroke="#415749" strokeWidth={2} fill="none" />
      {bulbs.map(([x, y, tilt]) => (
        <G key={x} transform={`translate(${x} ${y}) rotate(${tilt})`}>
          <Path d="M-3 6 C-10 8 -6 21 0 26 C6 21 10 8 3 6Z" fill="#be3a46" />
          <Rect x={-3.5} width={7} height={7} rx={1.5} fill="#b68e55" />
          <Path d="M-3 1 H3" stroke="#755f48" strokeWidth={2} />
          <Path d="M-3 10 l-1 4" stroke="#ffd8ba" strokeWidth={2} strokeLinecap="round" />
        </G>
      ))}
    </Svg>
  );
}

export function MarketGap({ index }: { index: number }) {
  if (index === 0) return null;
  if (index % 6 === 2) {
    return (
      <View className="h-12 items-end justify-center pr-4" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Svg width={31} height={39} viewBox="0 0 31 39" accessible={false}>
          <Rect x={13} y={32} width={5} height={6} fill="#bba88c" />
          <Path d="M15 1l8 12-4-1 7 11-4-1 8 12H1l8-12-4 1 7-11-4 1z" fill="#8fae98" />
          <Circle cx={15} cy={17} r={1.5} fill="#e4b85e" /><Circle cx={20} cy={26} r={1.5} fill="#e4b85e" />
          <Circle cx={12} cy={29} r={1.5} fill="#e4b85e" />
        </Svg>
      </View>
    );
  }
  if (index % 6 === 3) return <View className="h-14 justify-center"><MarketLights pair /></View>;
  return <View className="h-6" />;
}
