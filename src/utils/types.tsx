import { IconProps } from '@expo/vector-icons/build/createIconSet';
import {
  AntDesign,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

export type Language = 'en';

export type AntDesignProps = IconProps<
  keyof typeof AntDesign.glyphMap & string
>;
export type FoundationProps = IconProps<
  keyof typeof Foundation.glyphMap & string
>;
export type MaterialCommunityIconsProps = IconProps<
  keyof typeof MaterialCommunityIcons.glyphMap & string
>;
export type MaterialIconsProps = IconProps<
  keyof typeof MaterialIcons.glyphMap & string
>;
