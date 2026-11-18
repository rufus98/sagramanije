import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, Rect, Use } from 'react-native-svg';

export function SagraListGap({ index }: { index: number }) {
  if (!index) return null;
  const slot = index % 6;
  if (slot !== 2 && slot !== 5) return <View className="h-8" />;

  return (
    <View className={slot === 2 ? 'h-10 justify-center items-end pr-3' : 'h-12 justify-center items-start pl-3'}
      pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {slot === 2 ? (
        <Svg width={104} height={30} viewBox="0 0 104 30" accessible={false}>
          <Path d="m7 7 13 4-10 10Z" fill="#bd604b" />
          <Path d="m26 12 13 2-8 12Z" fill="#dfa74e" />
          <Path d="m45 15 13 0-6 12Z" fill="#648478" />
          <Path d="m65 14 13-2-4 13Z" fill="#cb7354" />
          <Path d="m84 11 12-4-2 13Z" fill="#deb05c" />
          <Path d="M2 5Q52 25 102 5" fill="none" stroke="#8a7260" strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      ) : (
        <Svg width={75} height={42} viewBox="0 0 75 42" accessible={false}>
          <Defs>
            <G id="arrosticino">
              <Path d="M0 0v29" stroke="#ae8557" strokeWidth={2} strokeLinecap="round" />
              <Rect x={-3.4} y={2} width={7} height={5} rx={1} fill="#975e43" />
              <Rect x={-3} y={8} width={6.5} height={4} rx={1} fill="#dfa66d" />
              <Rect x={-3.5} y={13} width={7} height={5} rx={1} fill="#925138" />
            </G>
          </Defs>
          <Ellipse cx={38} cy={37.5} rx={23} ry={2} fill="#eddfca" />
          <Use href="#arrosticino" transform="translate(24 6) rotate(-24)" />
          <Use href="#arrosticino" transform="translate(37 2) rotate(-6)" />
          <Use href="#arrosticino" transform="translate(51 6) rotate(19)" />
          <Path d="m24 23 26-1-12 16Z" fill="#d4aa74" />
          <Path d="m24 23 13 4 1 11Z" fill="#ecd0a1" />
        </Svg>
      )}
    </View>
  );
}

export function SagraLandscape() {
  return (
    <View className="-mx-5 mt-3" pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height={104} viewBox="0 0 420 104" preserveAspectRatio="xMidYMax slice" accessible={false}>
        <Defs>
          <G id="casa-borgo">
            <Rect width={22} height={14} fill="#e2bb8e" />
            <Path d="m-3 1 14-10 14 10Z" fill="#b8654d" />
            <Path d="M4 4h3v4H4z M15 4h3v4h-3z" fill="#746454" />
          </G>
          <G id="ulivo">
            <Path d="M0 0q-2-10 1-17m-1 8-6-8" stroke="#876a50" strokeWidth={3.5} fill="none" />
            <Ellipse cx={-3} cy={-18} rx={10} ry={7} fill="#79916e" />
            <Ellipse cx={4} cy={-20} rx={9} ry={7} fill="#91a27c" />
          </G>
        </Defs>
        <Circle cx={99} cy={24} r={10} fill="#efc779" />
        <Path d="M0 55 44 36 64 42 112 19 133 32 149 28 194 51 233 34 249 38 291 17 339 44 364 36 420 57V89H0Z" fill="#dddcc6" />
        <Path d="m266 30 25-13 25 14-18-6-7 2-6-4Z" fill="#f2ead5" />
        <Path d="M0 60Q59 42 119 62T225 56q70-37 150-9l45 12v34H0Z" fill="#bdc49b" />
        <Use href="#casa-borgo" transform="translate(246 45) scale(.78)" />
        <Use href="#casa-borgo" transform="translate(264 49) scale(.9)" />
        <Path d="M286 53V28h11v25Z" fill="#cfa77e" />
        <Path d="m284 29 7.5-10 7.5 10Z" fill="#a75d4a" />
        <Path d="M289 38v-4a2.5 2.5 0 0 1 5 0v4Z" fill="#7d6b57" />
        <Use href="#casa-borgo" transform="translate(298 46) scale(.8)" />
        <Use href="#casa-borgo" transform="translate(317 49) scale(.65)" />
        <Path d="M0 76Q70 44 136 67q53 16 109-6t118-7q33 5 57 15v35H0Z" fill="#d6b67a" />
        <Path d="M0 86q76-40 161-12t175-7q41-11 84 2v35H0Z" fill="#ead0a1" />
        <Path d="M221 86q-29-9-4-15t40-13q-6 9-27 16t23 13Z" fill="#fff0cf" />
        <Use href="#ulivo" transform="translate(31 75) scale(.86)" />
        <Use href="#ulivo" transform="translate(54 70) scale(.57)" />
        <Use href="#ulivo" transform="translate(374 78) scale(.98)" />
        <Path d="M0 90q67-17 145-3t151-1q59-12 124 0v18H0Z" fill="#fff7ee" />
      </Svg>
    </View>
  );
}
