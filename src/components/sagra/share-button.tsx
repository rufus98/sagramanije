import { Share2 } from 'lucide-react-native';
import { Platform, Share, TouchableOpacity } from 'react-native';

export type EventShare = { title: string; message: string; url?: string };

export default function ShareButton({ title, message, url }: EventShare) {
  const handleShare = async () => {
    try {
      await Share.share(Platform.OS === 'ios' && url
        ? { title, message, url }
        : { title, message: url ? `${message} ${url}` : message });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity onPress={handleShare} accessibilityRole="button" accessibilityLabel="Condividi evento"
      className="bg-white p-5 rounded-3xl shadow-xl shadow-black/10">
      <Share2 />
    </TouchableOpacity>
  );
}
