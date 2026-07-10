import { Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

const typeClasses = {
  default: 'text-xl leading-7 font-jakarta-medium',
  title: 'text-4xl leading-[52px] font-title',
  small: 'text-sm font-jakarta-medium',
  smallBold: 'text-sm font-jakarta-bold',
  subtitle: 'text-2xl font-title',
  link: 'text-sm leading-[30px] font-jakarta',
  linkPrimary: 'text-sm leading-[30px] font-jakarta',
  code: 'text-xs font-medium android:font-bold',
} satisfies Record<NonNullable<ThemedTextProps['type']>, string>;

export function ThemedText({
  className,
  style,
  type = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const color = type === 'linkPrimary' ? '#3c87f7' : theme[themeColor ?? 'text'];

  return (
    <Text
      className={`${typeClasses[type]} ${className ?? ''}`}
      style={[{ color }, type === 'code' && { fontFamily: Fonts.mono }, style]}
      {...rest}
    />
  );
}
