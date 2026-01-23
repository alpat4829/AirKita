import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "@/utils/maps";
import { MapPin, Loader } from "lucide-react";

export default function GoogleMapInput({
    latitude,
    longitude,
    onLocationChange,
    apiKey,
}) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchBox, setSearchBox] = useState(null);

    // Default to Padang if no coordinates provided
    const defaultLat = latitude || -0.9471;
    const defaultLng = longitude || 100.4172;

    useEffect(() => {
        const initMap = async () => {
            try {
                setLoading(true);

                // Debug: Check if API key is provided
                if (!apiKey) {
                    console.error("Google Maps API key is missing");
                    setError(
                        "API key tidak ditemukan. Silakan hubungi administrator.",
                    );
                    setLoading(false);
                    return;
                }

                console.log(
                    "Loading Google Maps with API key:",
                    apiKey.substring(0, 10) + "...",
                );
                await loadGoogleMapsScript(apiKey);
                console.log("Google Maps script loaded");

                // Use window.google.maps directly instead of returned value
                if (
                    !window.google ||
                    !window.google.maps ||
                    !window.google.maps.Map
                ) {
                    console.error("Google Maps not available on window object");
                    throw new Error(
                        "Google Maps API loaded but not accessible",
                    );
                }

                console.log("Creating map instance...");

                // Create map using window.google.maps
                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: {
                        lat: parseFloat(defaultLat),
                        lng: parseFloat(defaultLng),
                    },
                    zoom: 15,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                console.log("Map instance created successfully");
                setMap(mapInstance);

                // Create draggable marker
                const markerInstance = new window.google.maps.Marker({
                    position: {
                        lat: parseFloat(defaultLat),
                        lng: parseFloat(defaultLng),
                    },
                    map: mapInstance,
                    draggable: true,
                    title: "Drag untuk mengubah lokasi",
                });

                setMarker(markerInstance);

                // Listen to marker drag end
                markerInstance.addListener("dragend", () => {
                    const position = markerInstance.getPosition();
                    if (onLocationChange) {
                        onLocationChange({
                            latitude: position.lat(),
                            longitude: position.lng(),
                        });
                    }
                });

                // Create search box
                const input = document.getElementById("map-search-input");
                if (input) {
                    const searchBoxInstance = new google.maps.places.SearchBox(
                        input,
                    );
                    setSearchBox(searchBoxInstance);

                    mapInstance.addListener("bounds_changed", () => {
                        searchBoxInstance.setBounds(mapInstance.getBounds());
                    });

                    searchBoxInstance.addListener("places_changed", () => {
                        const places = searchBoxInstance.getPlaces();
                        if (places.length === 0) return;

                        const place = places[0];
                        if (!place.geometry || !place.geometry.location) return;

                        // Update map and marker
                        mapInstance.setCenter(place.geometry.location);
                        mapInstance.setZoom(17);
                        markerInstance.setPosition(place.geometry.location);

                        // Notify parent
                        if (onLocationChange) {
                            onLocationChange({
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng(),
                            });
                        }
                    });
                }

                setLoading(false);
                console.log("Map initialized successfully");
            } catch (err) {
                console.error("Error loading map:", err);
                setError(
                    `Gagal memuat peta: ${err.message || "Unknown error"}. Silakan refresh halaman.`,
                );
                setLoading(false);
            }
        };

        if (apiKey) {
            initMap();
        } else {
            console.error("API key not provided to GoogleMapInput");
            setError("API key tidak tersedia");
            setLoading(false);
        }
    }, [apiKey]);

    // Update marker position when props change
    useEffect(() => {
        if (marker && latitude && longitude) {
            const newPosition = {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
            };
            marker.setPosition(newPosition);
            if (map) {
                map.setCenter(newPosition);
            }
        }
    }, [latitude, longitude, marker, map]);

    if (error) {
        return (
            <div className="w-full h-96 rounded-xl bg-red-50 border-2 border-red-200 flex items-center justify-center p-6">
                <div className="text-center max-w-lg">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <div className="text-left bg-white p-4 rounded-lg text-sm space-y-2 mb-4">
                        <p className="font-semibold text-gray-900">
                            Kemungkinan penyebab:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>
                                Maps JavaScript API belum di-enable di Google
                                Cloud Console
                            </li>
                            <li>API key belum dikonfigurasi dengan benar</li>
                            <li>
                                Domain belum ditambahkan ke API restrictions
                            </li>
                        </ul>
                        <p className="font-semibold text-gray-900 mt-3">
                            Solusi:
                        </p>
                        <ol className="list-decimal list-inside text-gray-700 space-y-1">
                            <li>
                                Buka{" "}
                                <a
                                    href="https://console.cloud.google.com"
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    Google Cloud Console
                                </a>
                            </li>
                            <li>
                                Enable "Maps JavaScript API" dan "Places API"
                            </li>
                            <li>
                                Pastikan API key tidak di-restrict atau
                                tambahkan localhost ke allowed referrers
                            </li>
                        </ol>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                        Refresh Halaman
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    id="map-search-input"
                    type="text"
                    placeholder="Cari lokasi depot..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all"
                />
            </div>

            {/* Map Container */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200">
                {loading && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                        <div className="text-center">
                            <Loader className="w-8 h-8 text-water-500 animate-spin mx-auto mb-2" />
                            <p className="text-gray-600">Memuat peta...</p>
                        </div>
                    </div>
                )}
                <div ref={mapRef} className="w-full h-full" />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                    <strong>Cara menggunakan:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Cari lokasi menggunakan search box di atas</li>
                    <li>Atau drag marker (pin merah) ke lokasi depot Anda</li>
                    <li>Koordinat akan otomatis tersimpan</li>
                </ul>
            </div>

            {/* Coordinates Display */}
            {latitude && longitude && (
                <div className="text-xs text-gray-500 font-mono">
                    Koordinat: {parseFloat(latitude).toFixed(6)},{" "}
                    {parseFloat(longitude).toFixed(6)}
                </div>
            )}
        </div>
    );
}
