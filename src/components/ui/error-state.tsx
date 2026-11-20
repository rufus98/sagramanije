import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";

type ErrorStateProps = {
    title?: string;
    message?: string;
    actionColor?: string;
    onRetry?: () => void;
    isRetrying?: boolean;
};

export default function ErrorState({
    title = "Qualcosa è andato storto",
    message = "Non siamo riusciti a caricare le sagre. Controlla la connessione e riprova.",
    actionColor = Colors.primary,
    onRetry,
    isRetrying = false,
}: ErrorStateProps) {
    return (
        <View className="flex-1 items-center justify-center gap-3 px-8">
            <ThemedText type="subtitle" className="text-center">{title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" className="text-center">{message}</ThemedText>
            {onRetry && (
                <Pressable
                    onPress={onRetry}
                    disabled={isRetrying}
                    className={`mt-2 rounded-full px-6 py-3 active:opacity-80 ${isRetrying ? "opacity-50" : ""}`}
                    style={{ backgroundColor: actionColor }}
                >
                    <ThemedText type="smallBold" themeColor="background">
                        {isRetrying ? "Riprovo…" : "Riprova"}
                    </ThemedText>
                </Pressable>
            )}
        </View>
    );
}
