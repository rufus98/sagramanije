import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, NativeSyntheticEvent, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import * as MapLib from "@maplibre/maplibre-react-native";
import type { Coords } from "@/hooks/use-user-location";
import styleMap from "@/assets/map/style.json";
import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { Sagra } from "@/types/sagra";
import { formatDateRange } from "../date-formatter";
import { ThemedText } from "../themed-text";
import { Navigation, X } from "lucide-react-native";
import { Colors, MarketColors } from "@/constants/theme";
import { useTabScrollBottomPadding } from "@/components/app-tabs";
import { mapUtils } from "@/utils/map-utils";
import { marketHref } from "@/utils/mercatini";

const mapIcons = { pin: require("@/assets/map/pin.png") };
const marketIcons = {
    "sagramanije-market-tree-sdf": { source: require("@/assets/map/market-tree-sdf.png"), sdf: true },
};

// bounds che racchiudono l'Abruzzo: [ovest, sud, est, nord]
const ABRUZZO_BOUNDS: [number, number, number, number] = [
    12.9, 41.6, 14.9, 42.95,
];

// zoom usato quando centriamo sulla posizione dell'utente
const USER_ZOOM = 11;

function placeOf(sagra: Sagra) {
    return [sagra.citta, sagra.provincia].filter(Boolean).join(", ");
}

type MapProps = { location?: Coords; data: Sagra[]; variant?: "sagre" | "mercatini" };

export default function MapLibre({ location, data, variant = "sagre" }: MapProps) {
    const router = useRouter();
    const tabPadding = useTabScrollBottomPadding();
    const cameraRef = useRef<MapLib.CameraRef>(null);
    const sourceRef = useRef<MapLib.GeoJSONSourceRef>(null);
    const clusterRequest = useRef(0);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [cluster, setCluster] = useState<{ data: Sagra[]; events: Sagra[] } | null>(null);
    const isMarketMap = variant === "mercatini";
    const accent = isMarketMap ? MarketColors.berry : Colors.primary;
    const detailsBackground = isMarketMap ? MarketColors.blush : "#fbe7de";

    const eventsById = useMemo(() => new Map(data
        .filter(({ lat, leng }) => Math.abs(lat) <= 90 && Math.abs(leng) <= 180 && (lat !== 0 || leng !== 0))
        .map(event => [event.id, event])), [data]);

    const featureCollection = useMemo<GeoJSON.FeatureCollection>(
        () => ({
            type: "FeatureCollection",
            features: Array.from(eventsById.values(), sagra => ({
                type: "Feature",
                properties: { id: sagra.id },
                geometry: { type: "Point", coordinates: [sagra.leng, sagra.lat] },
            })),
        }),
        [eventsById]
    );

    useEffect(() => {
        return () => { clusterRequest.current += 1; };
    }, [data]);

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
        setCluster(null);
        setSelectedId(sagra.id);
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
        const request = ++clusterRequest.current;

        if (props.cluster) {
            const leaves = await sourceRef.current?.getClusterLeaves(
                props.cluster_id as number,
                props.point_count as number,
                0
            ).catch(() => []);
            if (request !== clusterRequest.current) return;
            const events = (leaves ?? []).flatMap(({ properties }) => {
                const event = eventsById.get(properties?.id as number);
                return event ? [event] : [];
            });
            if (events.length === 0) return;
            setSelectedId(null);
            setCluster({ data, events });
            return;
        }

        const selected = eventsById.get(props.id as number);
        if (selected) handleSelect(selected);
    };

    const selected = selectedId === null ? null : eventsById.get(selectedId);
    const clusterList = cluster?.data === data ? cluster.events : null;
    const dateRange = selected ? formatDateRange(selected) : null;
    const place = selected ? placeOf(selected) : "";

    if (isMarketMap && eventsById.size === 0) {
        return <View className="flex-1 items-center justify-center px-4" style={{ marginBottom: tabPadding }}>
            <ThemedText type="small" themeColor="textSecondary" className="text-center">
                Nessuno di questi mercatini ha una posizione sulla mappa.
            </ThemedText>
        </View>;
    }

    return (
        <View className="flex-1 w-full overflow-hidden rounded-3xl" style={{ marginBottom: tabPadding }}>
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

                <MapLib.Images images={isMarketMap ? marketIcons : mapIcons} />

                {/* un solo source GeoJSON con clustering: tutti i punti sono
                    disegnati nativamente sulla GPU, niente lag anche con tante sagre */}
                <MapLib.GeoJSONSource
                    id={variant}
                    ref={sourceRef}
                    data={featureCollection}
                    cluster
                    clusterRadius={50}
                    clusterMaxZoom={13}
                    hitbox={isMarketMap ? { top: 24, right: 24, bottom: 24, left: 24 } : undefined}
                    onPress={handlePress}
                >
                    {/* cerchio del cluster, raggio crescente col numero di sagre */}
                    <MapLib.Layer
                        id="clusters"
                        type="circle"
                        filter={["has", "point_count"]}
                        paint={{
                            "circle-color": isMarketMap ? MarketColors.pine : accent,
                            "circle-opacity": isMarketMap ? 1 : 0.9,
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
                    <MapLib.Layer
                        key="pin"
                        id="pin"
                        type="symbol"
                        filter={["!", ["has", "point_count"]]}
                        layout={{
                            "icon-image": isMarketMap ? "sagramanije-market-tree-sdf" : "pin",
                            "icon-size": isMarketMap ? 0.45 : 0.42,
                            "icon-anchor": isMarketMap ? "center" : "bottom",
                            "icon-allow-overlap": true,
                        }}
                        paint={isMarketMap ? { "icon-color": MarketColors.berry } : undefined}
                    />
                </MapLib.GeoJSONSource>
            </MapLib.Map>

            {/* lista scrollabile delle sagre di un cluster */}
            {clusterList && (
                <View
                    className="absolute bottom-4 left-4 right-4 max-h-[55%] rounded-2xl bg-white shadow-lg"
                >
                    <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
                        <ThemedText type="smallBold">
                            {clusterList.length} {isMarketMap
                                ? (clusterList.length === 1 ? "mercatino" : "mercatini")
                                : "sagre"} in zona
                        </ThemedText>
                        <Pressable accessibilityRole="button" accessibilityLabel="Chiudi elenco"
                            onPress={() => {
                                clusterRequest.current += 1;
                                setCluster(null);
                            }} hitSlop={8}>
                            <X size={20} color={Colors.text} />
                        </Pressable>
                    </View>
                    <FlatList
                        data={clusterList}
                        keyExtractor={item => String(item.id)}
                        renderItem={({ item }) => (
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => {
                                    clusterRequest.current += 1;
                                    handleSelect(item);
                                }}
                                className="border-b border-gray-100 px-4 py-3"
                            >
                                <ThemedText type="smallBold" style={{ color: accent }}>{item.nome_sagra}</ThemedText>
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
                <View
                    className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 shadow-lg"
                >
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Chiudi scheda"
                        onPress={() => {
                            clusterRequest.current += 1;
                            setSelectedId(null);
                        }}
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

                    <View className="mt-3 flex-row flex-wrap gap-2">
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => router.push(isMarketMap ? marketHref(selected) : {
                                pathname: "/sagra/[id]",
                                params: {
                                    id: selected.id,
                                    locandina: selected.locandina ?? undefined,
                                    distanza: selected.distanza_km ?? undefined,
                                },
                            })}
                            className="flex-1 items-center justify-center rounded-xl px-3 py-3"
                            style={{ backgroundColor: detailsBackground }}
                        >
                            <ThemedText type="smallBold" style={{ color: isMarketMap ? MarketColors.berry : "#9f321a" }}>
                                Dettagli
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => mapUtils.openDirections(selected)}
                            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl px-3 py-3"
                            style={{ backgroundColor: accent }}
                        >
                            <Navigation size={16} color="#fff" fill="#fff" />
                            <ThemedText type="smallBold" style={{ color: "#fff" }}>Indicazioni</ThemedText>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}
