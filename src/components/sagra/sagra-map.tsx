import * as MapLib from "@maplibre/maplibre-react-native";
import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import styleMap from "@/assets/map/style.json";
import { Sagra } from "@/types/sagra";
import { useMemo } from "react";
import { View } from "react-native";

const pinIcon = require("@/assets/map/pin.png");

// zoom fisso per inquadrare bene il punto della sagra
const DETAIL_ZOOM = 14;

// Mini-mappa non interattiva del dettaglio: un solo pin sulla posizione
// della sagra. Se le coordinate non sono valide non renderizza nulla.
export default function SagraMap({ sagra }: { sagra: Sagra }) {
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
                mapStyle={styleMap as unknown as StyleSpecification}
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

                <MapLib.Images images={{ pin: pinIcon }} />

                <MapLib.GeoJSONSource id="sagra-pin" data={featureCollection}>
                    <MapLib.Layer
                        id="pin"
                        type="symbol"
                        layout={{
                            "icon-image": "pin",
                            "icon-size": 0.42,
                            "icon-anchor": "bottom",
                            "icon-allow-overlap": true,
                        }}
                    />
                </MapLib.GeoJSONSource>
            </MapLib.Map>
        </View>
    );
}
