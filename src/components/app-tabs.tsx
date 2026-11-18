import { useMarketSeason } from '@/context/market-season';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Image, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import type { ColorValue, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  {
    name: 'mercatini',
    label: 'Mercatini',
    icon: require('@/assets/images/tabIcons/tree-pine.png'),
  },
  {
    name: 'sagre',
    label: 'Sagre',
    icon: require('@/assets/images/tabIcons/utensils-crossed.png'),
  },
  {
    name: 'info',
    label: 'Info',
    icon: require('@/assets/images/tabIcons/info.png'),
  },
] as const satisfies ReadonlyArray<{
  name: string;
  label: string;
  icon: ImageSourcePropType;
}>;

const iosMajorVersion =
  Platform.OS === 'ios' ? Number.parseInt(String(Platform.Version), 10) : null;
const usesPreIos26Tabs = iosMajorVersion !== null && iosMajorVersion < 26;
const selectedNativeIconColor = Platform.OS === 'android' ? '#fff' : Colors.primary;
const FLOATING_BAR_HEIGHT = 64;
const FLOATING_BAR_MIN_OFFSET = 12;

export function useTabScrollBottomPadding() {
  const { bottom } = useSafeAreaInsets();
  return usesPreIos26Tabs
    ? FLOATING_BAR_HEIGHT + Math.max(bottom, FLOATING_BAR_MIN_OFFSET) + 16
    : 40;
}

type TabIconProps = {
  color: ColorValue;
  source: ImageSourcePropType;
};

function TabIcon({ color, source }: TabIconProps) {
  return <Image className="h-6 w-6" source={source} style={{ tintColor: color }} />;
}

function PreIos26Tabs() {
  const { inSeason } = useMarketSeason();
  const tabBarWidth = inSeason ? 300 : 220;
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  return (
    <Tabs
      initialRouteName={inSeason ? 'mercatini' : 'sagre'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: Math.max(insets.bottom, FLOATING_BAR_MIN_OFFSET),
            width: Math.min(tabBarWidth, screenWidth),
            start: Math.max(0, (screenWidth - tabBarWidth) / 2),
          },
        ],
      }}>
      {tabs.map(({ icon, label, name }) => (
        <Tabs.Protected key={name} guard={name !== 'mercatini' || inSeason}>
          <Tabs.Screen
            name={name}
            options={{
              title: label,
              tabBarIcon: ({ color }) => <TabIcon color={color} source={icon} />,
            }}
          />
        </Tabs.Protected>
      ))}
    </Tabs>
  );
}

function SystemTabs() {
  const { inSeason } = useMarketSeason();
  return (
    <NativeTabs
      backgroundColor={Colors.background}
      disableTransparentOnScrollEdge
      indicatorColor={Colors.primary}
      iconColor={{
        default: Colors.textSecondary,
        selected: selectedNativeIconColor,
      }}
      labelStyle={{
        default: { color: Colors.textSecondary },
        selected: { color: Colors.primary },
      }}>
      {tabs.map(({ icon, label, name }) => (
        <NativeTabs.Trigger key={name} name={name} hidden={name === 'mercatini' && !inSeason}>
          <NativeTabs.Trigger.Label>{label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={icon} renderingMode="template" />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}

export default function AppTabs() {
  return usesPreIos26Tabs ? <PreIos26Tabs /> : <SystemTabs />;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    end: 'auto',
    height: FLOATING_BAR_HEIGHT,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: Colors.background,
    borderTopWidth: 0,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  tabBarLabel: {
    marginTop: 2,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 11,
  },
});
