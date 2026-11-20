import * as MapLib from "@maplibre/maplibre-react-native";
import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import styleMap from "@/assets/map/style.json";
import { MarketColors } from "@/constants/theme";
import type { Sagra } from "@/types/sagra";
import { useMemo } from "react";
import { View } from "react-native";

const pinIcon = require("@/assets/map/pin.png");
const marketPinIcon = { source: require("@/assets/map/market-tree-sdf.png"), sdf: true };
const defaultMapStyle = styleMap as unknown as StyleSpecification;
const mutedLandColors: Partial<Record<string, string>> = {
    park: "#e8e6df",
    landcover_wood: "#dedfd6",
    landcover_grass: "#e6e6db",
    landuse_pitch: "#e7e6dd",
    landuse_track: "#e7e6dd",
    landuse_cemetery: "#e3e4da",
};
const mutedMapStyle: StyleSpecification = {
    ...defaultMapStyle,
    layers: defaultMapStyle.layers.map(layer => {
        const color = mutedLandColors[layer.id];
        if (layer.type !== "fill" || !color) return layer;
        return { ...layer, paint: { ...layer.paint, "fill-color": color } };
    }),
};

// zoom fisso per inquadrare bene il punto della sagra
const DETAIL_ZOOM = 14;

// Mini-mappa non interattiva del dettaglio: un solo pin sulla posizione
// della sagra. Se le coordinate non sono valide non renderizza nulla.
export default function SagraMap({ sagra, variant = "sagre" }: { sagra: Pick<Sagra, "lat" | "leng">; variant?: "sagre" | "mercatini" }) {
    const isMarketMap = variant === "mercatini";
    const hasCoords = Number.isFinite(sagra.lat) && Number.isFinite(sagra.leng);

    const featureCollection = useMemo<GeoJSON.FeatureCollection>(
        () => ({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: { type: "Point", coordinates: [sagra.leng, sagra.lat] },
                },
            ],
        }),
        [sagra.lat, sagra.leng]
    );

    if (!hasCoords) return null;

    return (
        <View className="h-52 w-full overflow-hidden rounded-3xl">
            <MapLib.Map
                mapStyle={isMarketMap ? mutedMapStyle : defaultMapStyle}
                attribution={false}
                logo={false}
                compass={false}
                // statica: dentro la ScrollView non deve intercettare i gesti
                dragPan={false}
                touchZoom={false}
                doubleTapZoom={false}
                touchRotate={false}
                touchPitch={false}
            >
                <MapLib.Camera
                    initialViewState={{ center: [sagra.leng, sagra.lat], zoom: DETAIL_ZOOM }}
                />

                <MapLib.Images images={{ pin: isMarketMap ? marketPinIcon : pinIcon }} />

                <MapLib.GeoJSONSource id="sagra-pin" data={featureCollection}>
                    <MapLib.Layer
                        id="pin"
                        type="symbol"
                        layout={{
                            "icon-image": "pin",
                            "icon-size": isMarketMap ? 0.45 : 0.42,
                            "icon-anchor": isMarketMap ? "center" : "bottom",
                            "icon-allow-overlap": true,
                        }}
                        paint={isMarketMap ? { "icon-color": MarketColors.berry } : undefined}
                    />
                </MapLib.GeoJSONSource>
            </MapLib.Map>
        </View>
    );
}
