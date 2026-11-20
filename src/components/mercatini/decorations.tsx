import { useEffect, useState } from 'react';
import { useIsFocused } from 'expo-router';
import { AccessibilityInfo, AppState, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Snowflake as SnowCrystal } from 'lucide-react-native';
import Animated, {
  cancelAnimation, Easing, ReduceMotion, useAnimatedProps, useAnimatedStyle, useSharedValue,
  withRepeat, withTiming, type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop, Use } from 'react-native-svg';
import { MarketColors } from '@/constants/theme';

export function useMarketMotion() {
  const focused = useIsFocused();
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [reduceMotion, setReduceMotion] = useState(true);
  const progress = useSharedValue(0);
  const moving = focused && active && !reduceMotion;

  useEffect(() => {
    let readingPreference = true;
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      readingPreference = false;
      setReduceMotion(value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (readingPreference) setReduceMotion(value);
    }).catch(() => {});
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    setActive(AppState.currentState === 'active');
    return () => {
      readingPreference = false;
      preference?.remove();
      app.remove();
    };
  }, []);

  useEffect(() => {
    if (!moving) return;
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, {
      duration: 48_000, easing: Easing.linear, reduceMotion: ReduceMotion.Never,
    }), -1, false, undefined, ReduceMotion.Never);
    return () => cancelAnimation(progress);
  }, [moving, progress]);

  return moving ? progress : undefined;
}

// Edge lanes stay inside the exposed margins even on wide screens.
const lanes = [
  'left', 19, 'right', 41, 'left', 79, 'right', 57, 9, 'left', 35, 'right',
  'left', 66, 23, 'right', 5, 'left', 'right', 72, 13, 91, 'left', 'right',
] as const;

function Snowflake({ index, height, progress }: { index: number; height: number; progress: SharedValue<number> }) {
  const lane = lanes[index];
  const position = typeof lane === 'number' ? { left: `${lane}%` as const } : { [lane]: 2 + index % 4 };
  const crystal = index % 4 !== 1;
  const size = crystal ? 12 + index % 7 : 5;
  const speed = crystal ? 3 + index % 3 : 2;
  const drift = typeof lane === 'number' ? 13 : 3;
  const phase = (index * 0.618) % 1;
  const style = useAnimatedStyle(() => {
    const fall = (phase + progress.value * speed) % 1;
    return {
      transform: [
        { translateY: fall * (height + 2 * size) - size },
        { translateX: Math.sin(2 * Math.PI * (fall + phase)) * drift },
        { rotate: `${phase * 180 + fall * 120}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.flake, position, { width: size, height: size }, !crystal && styles.grain, style]}>
      {crystal && <SnowCrystal size={size} color="#7ca5b5" strokeWidth={2} />}
    </Animated.View>
  );
}

export function MarketSnow({ progress }: { progress: SharedValue<number> }) {
  const [height, setHeight] = useState(0);
  return (
    <View style={[StyleSheet.absoluteFill, styles.snow]} pointerEvents="none" aria-hidden
      onLayout={event => setHeight(event.nativeEvent.layout.height)}>
      {height > 0 && lanes.map((_, index) => (
        <Snowflake key={index} index={index} height={height} progress={progress} />
      ))}
    </View>
  );
}

const headerBulbs = [[14, 8, 12], [47, 12, 5], [84, 13, -4], [121, 12, 7], [157, 8, -11]];
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const haloRadius = 21;
const haloCenterY = 15;
const haloSize = 2 * haloRadius;
const haloTop = haloCenterY - haloRadius;
const bulbViewBox = `${-haloRadius} ${haloTop} ${haloSize} ${haloSize}`;

function getBulbOpacity(phase: number, progress?: number) {
  'worklet';
  if (progress === undefined) return 0.58;
  const wave = Math.cos(2 * Math.PI * (progress * (4 + Math.round(phase * 3)) + phase));
  return 0.58 + 0.32 * wave;
}

function BulbGlow({ phase, progress }: { phase: number; progress?: SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => ({ opacity: getBulbOpacity(phase, progress?.value) }));
  return <AnimatedCircle cy={haloCenterY} r={haloRadius} fill="url(#garlandHalo)" animatedProps={animatedProps} />;
}

function GarlandHaloGradient() {
  return (
    <RadialGradient id="garlandHalo">
      <Stop offset="0" stopColor="#ffb740" stopOpacity={0.95} />
      <Stop offset="1" stopColor="#ffbf55" stopOpacity={0} />
    </RadialGradient>
  );
}

function GarlandBulbArt({ amber }: { amber: boolean }) {
  return (
    <>
      <Path d="M-4 6 C-7 10 -9 14 -7 19 C-6 23 -2 27 0 29 C3 26 7 22 8 17 C9 13 6 9 4 6Z"
        fill={amber ? '#efa839' : MarketColors.berry} stroke={amber ? '#c9852d' : MarketColors.berry} strokeWidth={0.9} />
      <Path d="M-3 10 Q-6 14 -5 17" stroke="#fff0c7" strokeWidth={2.3} strokeLinecap="round" fill="none" />
      <Rect x={-4.5} y={0} width={9} height={7} rx={2} fill="#746550" />
      <Path d="M-3 2.5 H3" stroke="#ddbb83" strokeWidth={1.2} />
    </>
  );
}

// Socket positions are knots on the illustrated cord, in a 400-point composition.
const garlandBulbs = [
  { x: 19, y: 12, tilt: 13, scale: 0.79, amber: true, phase: 0.17 },
  { x: 69, y: 25, tilt: -7, scale: 0.86, amber: false, phase: 0.84 },
  { x: 113, y: 24, tilt: -14, scale: 0.94, amber: true, phase: 0.38 },
  { x: 177, y: 10, tilt: 8, scale: 0.75, amber: true, phase: 0.62 },
  { x: 222, y: 10, tilt: 15, scale: 1, amber: false, phase: 0.04 },
  { x: 283, y: 21, tilt: -5, scale: 0.87, amber: true, phase: 0.46 },
  { x: 324, y: 18, tilt: -12, scale: 0.91, amber: false, phase: 0.93 },
  { x: 383, y: 5, tilt: 6, scale: 0.79, amber: true, phase: 0.28 },
];

function AndroidGarlandBulb({ bulb, left, progress }: {
  bulb: (typeof garlandBulbs)[number];
  left: number;
  progress?: SharedValue<number>;
}) {
  const { y, tilt, scale, amber, phase } = bulb;
  const glow = useAnimatedStyle(() => ({ opacity: getBulbOpacity(phase, progress?.value) }));
  return (
    <View style={[styles.garlandBulb, {
      left: left - haloRadius,
      top: y + haloTop,
      transform: [{ rotate: `${tilt}deg` }, { scale }],
    }]}>
      {/* Updating an SVG child's opacity on Android redraws its entire SVG. */}
      <Animated.View style={[StyleSheet.absoluteFill, glow]}>
        <Svg width={haloSize} height={haloSize} viewBox={bulbViewBox}>
          <Defs><GarlandHaloGradient /></Defs>
          <Circle cy={haloCenterY} r={haloRadius} fill="url(#garlandHalo)" />
        </Svg>
      </Animated.View>
      <Svg width={haloSize} height={haloSize} viewBox={bulbViewBox}>
        <GarlandBulbArt amber={amber} />
      </Svg>
    </View>
  );
}

export function MarketGarland({ progress }: { progress?: SharedValue<number> }) {
  const { width } = useWindowDimensions();
  const horizontalScale = width / 400;
  const android = Platform.OS === 'android';
  const illustration = (
    <Svg width="100%" height={54} viewBox={`0 0 ${width} 54`} accessible={false} pointerEvents="none">
      <Defs>
        <G id="pineTwig" fill="none" strokeLinecap="round">
          <Path d="M0 0 C13 1 25 8 45 4" stroke="#4e5941" strokeWidth={1.8} />
          <Path d="M2 0 Q7 7 15 10 M7 2 Q15 11 22 12 M14 4 Q21 12 29 13
            M20 5 Q28 11 35 10 M29 6 Q37 10 43 8 M36 5 L47 6"
            stroke="#315e4c" strokeWidth={2.2} />
          <Path d="M4 1 Q9 -4 14 -7 M9 2 Q16 -2 21 -7 M15 4 Q22 0 28 -5
            M23 5 Q30 2 36 -3 M29 6 Q37 3 42 0 M36 5 L47 2"
            stroke="#648672" strokeWidth={1.9} />
          <Path d="M10 3 L18 8 M19 5 L28 9 M26 5 L35 2" stroke="#91a28a" strokeWidth={1.2} />
        </G>
        <G id="hollyLeaf">
          <Path d="M0 0 Q5 -1 7 -6 Q10 -4 15 -8 Q17 -6 24 -6 Q20 -2 19 2
            Q15 1 12 6 Q8 3 5 5 Q4 2 0 0Z" fill="#265843" />
          <Path d="M2 0 Q11 0 21 -5" stroke="#83a084" strokeWidth={0.9} fill="none" />
        </G>
        <G id="leafySpray">
          <Path d="M0 0 Q19 7 43 -2" stroke="#61765d" strokeWidth={1.4} fill="none" />
          <Path d="M5 1 Q8 -6 20 -6 Q16 1 5 1Z M17 3 Q22 -3 32 -5 Q29 1 17 3Z
            M30 1 Q35 -6 46 -5 Q40 0 30 1Z" fill="#718d73" />
          <Path d="M8 2 Q18 2 24 11 Q13 10 8 2Z M24 2 Q32 1 39 7 Q30 8 24 2Z"
            fill="#42684e" />
        </G>
        <G id="hollyBerries">
          <Circle cx={-3} cy={0} r={3.6} fill={MarketColors.berry} />
          <Circle cx={3} cy={1} r={3.2} fill={MarketColors.berry} />
          <Circle cy={5} r={3.1} fill={MarketColors.berry} />
          <Circle cx={2.3} cy={0} r={0.8} fill="#f2af8f" />
        </G>
        {!android && <GarlandHaloGradient />}
      </Defs>
      <Path d="M-3 1 Q9 7 19 12 Q46 25 69 25 Q92 27 113 24 Q144 19 177 10
        Q197 4 205 5 Q211 7 222 10 Q255 22 283 21 Q307 22 324 18 Q360 7 383 5 Q395 4 404 0"
        transform={`scale(${horizontalScale} 1)`} stroke="#54634f" strokeWidth={2} fill="none" />
      <G transform={`scale(${horizontalScale} 1)`}>
        <Path d="M48 22 C79 21 86 33 113 27 S149 12 177 11
          M216 9 C239 10 251 31 277 26 S321 13 353 12"
          stroke="#59765a" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <Use href="#leafySpray" transform="translate(62 23) rotate(8)" />
        <Use href="#pineTwig" transform="translate(86 27) rotate(-12) scale(1.08 0.76)" />
        <Use href="#hollyLeaf" transform="translate(106 28) rotate(38) scale(0.68)" />
        <Use href="#leafySpray" transform="translate(119 25) rotate(-19) scale(1.13 0.92)" />
        <Use href="#pineTwig" transform="translate(149 16) rotate(-22) scale(0.67)" />
        <Use href="#hollyBerries" transform="translate(103 26) scale(0.64)" />
        <Use href="#leafySpray" transform="translate(213 8) rotate(22) scale(0.94)" />
        <Use href="#pineTwig" transform="translate(238 16) rotate(18) scale(1.17 1.03)" />
        <Use href="#leafySpray" transform="translate(252 23) rotate(45) scale(0.73)" />
        <Use href="#hollyBerries" transform="translate(252 22) scale(0.87)" />
        <Use href="#leafySpray" transform="translate(274 26) rotate(-11)" />
        <Use href="#pineTwig" transform="translate(303 19) rotate(-18) scale(0.85)" />
        <Use href="#hollyLeaf" transform="translate(328 14) rotate(25) scale(0.72)" />
        <Use href="#leafySpray" transform="translate(335 14) rotate(-15) scale(0.84)" />
      </G>
      <G transform="translate(-4 3)">
        <Use href="#pineTwig" transform="rotate(39) scale(0.94)" />
        <Use href="#pineTwig" transform="translate(13 7) rotate(22) scale(1.14)" />
        <Use href="#pineTwig" transform="translate(31 15) rotate(3) scale(1.12)" />
        <Use href="#pineTwig" transform="translate(49 21) rotate(-12) scale(0.87)" />
        <Use href="#hollyLeaf" transform="translate(25 12) rotate(83)" />
        <Use href="#hollyLeaf" transform="translate(25 12) rotate(-13) scale(0.82)" />
        <Use href="#hollyBerries" transform="translate(24 12)" />
      </G>
      <G transform={`translate(${204 * horizontalScale} 6)`}>
        <Use href="#pineTwig" transform="rotate(153) scale(0.79)" />
        <Use href="#hollyLeaf" transform="rotate(38) scale(0.9)" />
        <Use href="#hollyLeaf" transform="rotate(91) scale(0.67)" />
        <Use href="#hollyBerries" transform="scale(0.78)" />
      </G>
      <G transform={`translate(${width + 3} 2)`}>
        <Use href="#pineTwig" transform="scale(-1 1) rotate(5) scale(1.08)" />
        <Use href="#pineTwig" transform="translate(-18 4) scale(-1 1) rotate(22) scale(0.87)" />
        <Use href="#hollyLeaf" transform="translate(-11 2) rotate(100) scale(0.8)" />
      </G>
      {!android && garlandBulbs.map(({ x, y, tilt, scale, amber, phase }) => (
        <G key={x} transform={`translate(${x * horizontalScale} ${y}) rotate(${tilt}) scale(${scale})`}>
          <BulbGlow phase={phase} progress={progress} />
          <GarlandBulbArt amber={amber} />
        </G>
      ))}
    </Svg>
  );
  if (!android) return illustration;
  return (
    <View style={styles.garland} pointerEvents="none" aria-hidden>
      {illustration}
      {garlandBulbs.map(bulb => (
        <AndroidGarlandBulb key={bulb.x} bulb={bulb} left={bulb.x * horizontalScale} progress={progress} />
      ))}
    </View>
  );
}

export function MarketLights() {
  return (
    <Svg width={132} height={33} viewBox="0 0 176 44" accessible={false} pointerEvents="none">
      <Path d="M0 5 Q88 22 176 5" stroke={MarketColors.pine} strokeWidth={2} fill="none" />
      {headerBulbs.map(([x, y, tilt]) => (
        <G key={x} transform={`translate(${x} ${y}) rotate(${tilt})`}>
          <Path d="M-3 6 C-10 8 -6 21 0 26 C6 21 10 8 3 6Z" fill={MarketColors.berry} />
          <Rect x={-3.5} width={7} height={7} rx={1.5} fill="#b68e55" />
          <Path d="M-3 1 H3" stroke="#755f48" strokeWidth={2} />
          <Path d="M-3 10 l-1 4" stroke="#ffd8ba" strokeWidth={2} strokeLinecap="round" />
        </G>
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  snow: { overflow: 'hidden' },
  flake: { position: 'absolute', top: 0 },
  grain: { borderRadius: 3, backgroundColor: '#b3cbd2' },
  garland: { overflow: 'hidden' },
  garlandBulb: { position: 'absolute', transformOrigin: [haloRadius, -haloTop, 0] },
});
