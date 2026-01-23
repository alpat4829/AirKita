import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "@/utils/maps";
import { MapPin, Loader } from "lucide-react";

export default function GoogleMapDisplay({
    latitude,
    longitude,
    depotName,
    apiKey,
}) {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't load map if no coordinates
        if (!latitude || !longitude) {
            setLoading(false);
            return;
        }

        const initMap = async () => {
            try {
                setLoading(true);
                await loadGoogleMapsScript(apiKey);

                // Use window.google.maps directly
                if (
                    !window.google ||
                    !window.google.maps ||
                    !window.google.maps.Map
                ) {
                    throw new Error("Google Maps not available");
                }

                const position = {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                };

                // Create map using window.google.maps
                const map = new window.google.maps.Map(mapRef.current, {
                    center: position,
                    zoom: 16,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                });

                // Create marker
                const marker = new window.google.maps.Marker({
                    position: position,
                    map: map,
                    title: depotName || "Lokasi Depot",
                });

                // Create info window
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="padding: 8px;">
                            <h3 style="font-weight: 600; margin-bottom: 4px;">${depotName || "Depot"}</h3>
                            <p style="font-size: 12px; color: #666;">Klik marker untuk navigasi</p>
                        </div>
                    `,
                });

                // Show info window on marker click
                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                    // Open Google Maps in new tab
                    window.open(
                        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                        "_blank",
                    );
                });

                setLoading(false);
            } catch (err) {
                console.error("Error loading map:", err);
                setError("Gagal memuat peta");
                setLoading(false);
            }
        };

        initMap();
    }, [latitude, longitude, depotName, apiKey]);

    // If no coordinates, show placeholder
    if (!latitude || !longitude) {
        return (
            <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Lokasi belum diatur</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full rounded-xl bg-red-50 flex items-center justify-center">
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gray-200">
            {loading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                    <Loader className="w-8 h-8 text-water-500 animate-spin" />
                </div>
            )}
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
