import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Linking, NativeSyntheticEvent, Platform, Pressable, View } from "react-native";
import * as MapLib from "@maplibre/maplibre-react-native";
import type { Coords } from "@/hooks/use-user-location";
import styleMap from "@/assets/map/style.json";
import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { Sagra } from "@/types/sagra";
import { ThemedText } from "../themed-text";
import { Navigation, X } from "lucide-react-native";
import { Colors } from "@/constants/theme";

// asset del pin generato (colore primario)
const pinIcon = require("@/assets/map/pin.png");

// bounds che racchiudono l'Abruzzo: [ovest, sud, est, nord]
const ABRUZZO_BOUNDS: [number, number, number, number] = [
    12.9, 41.6, 14.9, 42.95,
];

// zoom usato quando centriamo sulla posizione dell'utente
const USER_ZOOM = 11;

// apre l'app mappe nativa con le indicazioni verso la sagra
function openDirections(sagra: Sagra) {
    const { lat, leng } = sagra;
    const label = encodeURIComponent(sagra.nome_sagra);
    const url = Platform.select({
        ios: `http://maps.apple.com/?daddr=${lat},${leng}&q=${label}`,
        android: `google.navigation:q=${lat},${leng}`,
    })!;
    // fallback web se l'app nativa non è disponibile
    Linking.openURL(url).catch(() =>
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${leng}`
        )
    );
}

// "8 lug" / "8 lug – 10 lug"
function formatDateRange(sagra: Sagra) {
    const fmt = (d: Date) =>
        d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
    if (!sagra.data_inizio) return null;
    if (!sagra.data_fine || sagra.data_fine.getTime() === sagra.data_inizio.getTime())
        return fmt(sagra.data_inizio);
    return `${fmt(sagra.data_inizio)} – ${fmt(sagra.data_fine)}`;
}

function placeOf(sagra: Sagra) {
    return [sagra.citta, sagra.provincia].filter(Boolean).join(", ");
}

export default function MapLibre({ location, data }: { location: Coords, data: Sagra[] }) {
    const cameraRef = useRef<MapLib.CameraRef>(null);
    const sourceRef = useRef<MapLib.GeoJSONSourceRef>(null);
    const [selected, setSelected] = useState<Sagra | null>(null);
    // lista scrollabile mostrata al tap su un cluster
    const [clusterList, setClusterList] = useState<Sagra[] | null>(null);

    // tutte le sagre in un unico layer nativo (niente più una View per marker):
    // l'indice nelle properties permette di risalire alla Sagra originale
    const featureCollection = useMemo<GeoJSON.FeatureCollection>(
        () => ({
            type: "FeatureCollection",
            features: data.map((sagra, index) => ({
                type: "Feature",
                properties: { index },
                geometry: { type: "Point", coordinates: [sagra.leng, sagra.lat] },
            })),
        }),
        [data]
    );

    // quando arriva la posizione dell'utente centriamo la mappa su di lui
    useEffect(() => {
        if (location) {
            cameraRef.current?.flyTo({
                center: [location.lng, location.lat],
                zoom: USER_ZOOM,
                duration: 1000,
            });
        }
    }, [location?.lat, location?.lng]);

    const handleSelect = (sagra: Sagra) => {
        setClusterList(null);
        setSelected(sagra);
        // centriamo la mappa sulla sagra toccata
        cameraRef.current?.flyTo({ center: [sagra.leng, sagra.lat], duration: 600 });
    };

    // tap su source: distingue cluster (mostra lista) da pin singolo (mostra card)
    const handlePress = async (
        event: NativeSyntheticEvent<MapLib.PressEventWithFeatures>
    ) => {
        const feature = event.nativeEvent.features?.[0];
        if (!feature) return;
        const props = feature.properties ?? {};

        if (props.cluster) {
            // recupera tutte le sagre raggruppate in questo cluster
            const leaves = await sourceRef.current?.getClusterLeaves(
                props.cluster_id as number,
                props.point_count as number,
                0
            );
            const sagre = (leaves ?? [])
                .map((f) => data[f.properties?.index as number])
                .filter(Boolean);
            setSelected(null);
            setClusterList(sagre);
            return;
        }

        handleSelect(data[props.index as number]);
    };

    const dateRange = selected ? formatDateRange(selected) : null;
    const place = selected ? placeOf(selected) : "";

    return (
        <View className="flex-1 w-full overflow-hidden">
            <MapLib.Map mapStyle={styleMap as unknown as StyleSpecification} attribution={false} logo={false}>
                <MapLib.Camera
                    ref={cameraRef}
                    // stato iniziale: se ho già la posizione centro lì, altrimenti
                    // inquadro tutta la regione tramite i bounds
                    initialViewState={
                        location
                            ? { center: [location.lng, location.lat], zoom: USER_ZOOM }
                            : { bounds: ABRUZZO_BOUNDS }
                    }
                />

                <MapLib.Images images={{ pin: pinIcon }} />

                {/* un solo source GeoJSON con clustering: tutti i punti sono
                    disegnati nativamente sulla GPU, niente lag anche con tante sagre */}
                <MapLib.GeoJSONSource
                    id="sagre"
                    ref={sourceRef}
                    data={featureCollection}
                    cluster
                    clusterRadius={50}
                    clusterMaxZoom={13}
                    onPress={handlePress}
                >
                    {/* cerchio del cluster, raggio crescente col numero di sagre */}
                    <MapLib.Layer
                        id="clusters"
                        type="circle"
                        filter={["has", "point_count"]}
                        paint={{
                            "circle-color": Colors.primary,
                            "circle-opacity": 0.9,
                            "circle-stroke-width": 3,
                            "circle-stroke-color": "#ffffff",
                            "circle-radius": [
                                "step",
                                ["get", "point_count"],
                                16, 10, 20, 25, 26,
                            ],
                        }}
                    />
                    {/* conteggio dentro il cluster */}
                    <MapLib.Layer
                        id="cluster-count"
                        type="symbol"
                        filter={["has", "point_count"]}
                        layout={{
                            "text-field": ["get", "point_count_abbreviated"],
                            "text-font": ["Noto Sans Bold"],
                            "text-size": 13,
                            "text-allow-overlap": true,
                            "text-ignore-placement": true,
                        }}
                        paint={{ "text-color": "#ffffff" }}
                    />
                    {/* pin singolo per le sagre non raggruppate */}
                    <MapLib.Layer
                        id="pin"
                        type="symbol"
                        filter={["!", ["has", "point_count"]]}
                        layout={{
                            "icon-image": "pin",
                            "icon-size": 0.42,
                            "icon-anchor": "bottom",
                            "icon-allow-overlap": true,
                        }}
                    />
                </MapLib.GeoJSONSource>
            </MapLib.Map>

            {/* lista scrollabile delle sagre di un cluster */}
            {clusterList && (
                <View className="absolute bottom-4 left-4 right-4 max-h-[55%] rounded-2xl bg-white shadow-lg">
                    <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
                        <ThemedText type="smallBold">
                            {clusterList.length} sagre in zona
                        </ThemedText>
                        <Pressable onPress={() => setClusterList(null)} hitSlop={8}>
                            <X size={20} color={Colors.text} />
                        </Pressable>
                    </View>
                    <FlatList
                        data={clusterList}
                        keyExtractor={(item, i) => `${item.nome_sagra}-${i}`}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handleSelect(item)}
                                className="border-b border-gray-100 px-4 py-3"
                            >
                                <ThemedText type="smallBold" themeColor="primary">{item.nome_sagra}</ThemedText>
                                {!!placeOf(item) && (
                                    <ThemedText type="small">{placeOf(item)}</ThemedText>
                                )}
                                {!!formatDateRange(item) && (
                                    <ThemedText type="small">{formatDateRange(item)}</ThemedText>
                                )}
                            </Pressable>
                        )}
                    />
                </View>
            )}

            {/* card info al tap sul pin singolo */}
            {selected && (
                <View className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-lg">
                    <Pressable
                        onPress={() => setSelected(null)}
                        className="absolute right-3 top-3 z-10"
                        hitSlop={8}
                    >
                        <X size={20} color={Colors.text} />
                    </Pressable>

                    <ThemedText type="smallBold" className="pr-6">
                        {selected.nome_sagra}
                    </ThemedText>
                    {!!place && <ThemedText type="small">{place}</ThemedText>}
                    {!!dateRange && <ThemedText type="small">{dateRange}</ThemedText>}

                    <Pressable
                        onPress={() => openDirections(selected)}
                        className="mt-3 flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3"
                    >
                        <Navigation size={16} color="#fff" fill="#fff" />
                        <ThemedText type="smallBold" style={{ color: "#fff" }}>
                            Indicazioni
                        </ThemedText>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
