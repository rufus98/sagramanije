import { View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Rect, Use } from 'react-native-svg';
import { MarketColors } from '@/constants/theme';

export default function WinterLandscape() {
  return (
    <View className="-mx-5 mt-3" pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height={96} viewBox="0 0 420 100" preserveAspectRatio="xMidYMax slice" accessible={false}>
        <Defs>
          <Path id="winter-pine" d="M0 0l7 12H4l7 10H7l8 12H2v4h-4v-4h-13l8-12h-4l7-10h-3Z" fill="#626f7a" />
          <G id="winter-house">
            <Rect x={1} y={0} width={27} height={18} fill="#bc8871" />
            <Path d="M-3 1 14-12 32 1Z" fill={MarketColors.berry} />
            <Path d="M-3 0 14-14 32 0 27-1 14-10 2 0Z" fill="#fffcf3" />
            <Path d="M6 5h4v5H6z M19 5h4v5h-4z" fill="#ffe5a0" />
          </G>
        </Defs>
        <Circle cx={294} cy={21} r={8} fill="#edcf93" />
        <Path d="M0 65 58 41 80 49 137 18 193 51 234 32 279 54 344 20 420 57V100H0Z"
          fill="#e5e8ec" />
        <Path d="m109 34 28-16 24 14-15-5-6 2-5-4-8 6-3-2Z" fill="#fffdf6" />
        <Path d="M0 69Q55 45 119 63T239 58Q307 40 359 56T420 55V100H0Z"
          fill="#cdd4de" />
        <Path d="M0 78Q83 57 164 74T324 69Q376 58 420 66V100H0Z"
          fill="#e7e9ed" />
        <Use href="#winter-pine" transform="translate(30 42) scale(.85)" />
        <Use href="#winter-pine" transform="translate(48 54) scale(.57)" />
        <Use href="#winter-house" transform="translate(218 59) scale(.78)" />
        <Use href="#winter-house" transform="translate(249 57)" />
        <Use href="#winter-house" transform="translate(282 61) scale(.72)" />
        <Use href="#winter-pine" transform="translate(360 48) scale(.75)" />
        <Use href="#winter-pine" transform="translate(385 35)" />
        <Path d="M0 81Q52 67 120 79T250 78Q307 66 368 77Q401 81 420 74V100H0Z" fill="#f6f5ea" />
        <Path d="M0 92Q78 79 149 87T289 85Q352 78 420 87V100H0Z" fill="#fff7ee" />
      </Svg>
    </View>
  );
}
