
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import { StyleSheet } from "react-native";

export default function ImagePlaceholder() {

    return <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
            <Pattern id="stripes" width={45.254} height={45.254} patternUnits="userSpaceOnUse">
                <Rect width={45.254} height={45.254} fill="rgb(236,90,53)" fillOpacity={0.07} />
                <Path d="M0 0 L22.627 0 L0 22.627 Z M45.254 0 L45.254 22.627 L22.627 45.254 L0 45.254 Z" fill="rgb(236,90,53)" fillOpacity={0.15} />
            </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#stripes)" />
    </Svg>
}