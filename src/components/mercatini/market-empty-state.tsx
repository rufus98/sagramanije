import { Pressable, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { ThemedText } from '@/components/themed-text';

function WinterStall() {
  return (
    <View className="w-full max-w-72" pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height={148} viewBox="0 0 280 152" accessible={false}>
        {/* Un piccolo borgo che sfuma nel fondo crema della pagina. */}
        <Circle cx={145} cy={75} r={64} fill="#f4e7d4" />
        <Circle cx={177} cy={41} r={9} fill="#edca89" />
        <Path d="M34 111 77 76l17 12 40-38 45 38 27-19 40 42Z" fill="#d6e2d6" />
        <Path d="m117 66 17-16 18 16-13-5-5 3-5-5Z" fill="#fffaf0" />
        <Ellipse cx={141} cy={128} rx={113} ry={9} fill="#e0e8de" />
        <Path d="M37 120 49 98h-6l12-23 12 23h-6l13 22Z" fill="#739487" />
        <Path d="M202 122 217 97h-7l14-31 14 31h-7l14 25Z" fill="#446e60" />
        <Rect x={222} y={120} width={4} height={7} fill="#9b795b" />
        {/* Imposte di legno e tenda a righe, come nelle copertine. */}
        <Rect x={87} y={76} width={99} height={51} rx={2} fill="#ba8767" />
        <Rect x={94} y={81} width={59} height={27} rx={1} fill="#90644f" />
        <Path d="M96 90h55m-55 9h55" fill="none" stroke="#b08265" strokeWidth={2} />
        <Rect x={160} y={83} width={17} height={20} rx={2} fill="#f9d38f" />
        <Path d="M168.5 83v20m-8.5-10h17" stroke="#95684d" strokeWidth={2} />
        <Path d="M81 76l11-23h88l13 23Z" fill="#a44750" />
        <Path d="m98 55-7 21h11l5-21zm22 0-3 21h11l1-21zm22 0 1 21h11l-3-21zm22 0 6 21h11l-8-21z" fill="#f6ddad" />
        <Path d="M88 57q0-7 8-7h80q8 0 9 8l-22-1q-8 4-16 0l-26 1q-7 4-15 0Z" fill="#fffaf0" />
        <Rect x={84} y={108} width={105} height={5} rx={2} fill="#865e4c" />
        <Circle cx={124} cy={94} r={6} stroke="#456b58" strokeWidth={4} fill="none" />
        <Path d="m119 88 5 1 5-2-1 5-4-2-4 2Z" fill="#ab414b" />
        <Path d="M57 129q17-7 31-3t27 1m52 4q14-4 25-2" fill="none" stroke="#fffaf0" strokeWidth={4} strokeLinecap="round" />
        <Path d="m88 29 1.4 4.2 4.2 1.4-4.2 1.4L88 40l-1.4-4.6-4.1-1.4 4.1-1.4Z" fill="#cfa969" />
      </Svg>
    </View>
  );
}

export default function MarketEmptyState({ onClearSearch }: { onClearSearch?: () => void }) {
  return (
    <View className="items-center px-4 py-6">
      <WinterStall />
      <ThemedText type="subtitle" className="mt-3 text-center" style={{ color: '#174d3f' }}>
        {onClearSearch ? 'Nessun mercatino trovato' : 'Ancora nessun mercatino'}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" className="mt-2 max-w-72 text-center">
        {onClearSearch ? 'Prova con un altro nome o con un comune vicino.' : 'Qui troverai i mercatini di Natale in Abruzzo appena saranno in catalogo.'}
      </ThemedText>
      {onClearSearch && (
        <Pressable onPress={onClearSearch} accessibilityRole="button" className="mt-4 rounded-2xl bg-[#174d3f] px-5 py-3 active:opacity-75">
          <ThemedText type="smallBold" style={{ color: '#fff' }}>Mostra tutti i mercatini</ThemedText>
        </Pressable>
      )}
    </View>
  );
}
