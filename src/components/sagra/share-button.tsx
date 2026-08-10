import { Share2, Share as ShareIcon } from "lucide-react-native";
import { TouchableOpacity, Share } from "react-native";
import type { Sagra } from "@/types/sagra";

interface ShareButtonProps {
    sagra: Sagra;
}

export default function ShareButton({ sagra }: ShareButtonProps) {

    const handleShare = async () => {
        try {
            // NOTA: Per fare in modo che apra l'app o rimandi allo store serve un Universal Link (iOS) o App Link (Android).
            // Di base è un link https al sito (es. sagramanije.it), configurato per intercettare l'app.
            const url = `https://sagramanije.it/sagra/${sagra.id}`;
            const message = `Scopri la sagra "${sagra.nome_sagra}"! ${url}`;
            
            await Share.share({
                message,
                url, // usato da iOS
                title: sagra.nome_sagra,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TouchableOpacity onPress={handleShare} className="bg-white p-5 rounded-3xl shadow-xl shadow-black/10">
            <Share2 />
        </TouchableOpacity>
    )
}