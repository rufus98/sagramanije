import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { Platform } from 'react-native';

export default function AppTabs() {

  const selectedIconColor = Platform.OS === 'android' ? '#fff' : Colors.primary;
  
  return (
    <NativeTabs
      backgroundColor={Colors.background}
      indicatorColor={Colors.primary}
      iconColor={{
        default: Colors.textSecondary,
        selected: selectedIconColor,
      }}
      labelStyle={{ selected: { color: Colors.primary }, default: {color: Colors.textSecondary} }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Sagre</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/utensils-crossed.png')}
          renderingMode="template"
          
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="info">
        <NativeTabs.Trigger.Label>Info</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/info.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
