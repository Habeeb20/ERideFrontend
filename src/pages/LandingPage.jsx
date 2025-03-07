import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaCar } from "react-icons/fa";
import { Button } from "@mui/material";

const LandingPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [carPositions, setCarPositions] = useState([
    { lat: 37.7749, lng: -122.4194 }, // San Francisco (example)
    { lat: 37.7750, lng: -122.4184 },
    { lat: 37.7748, lng: -122.4204 },
  ]);
  const mapRef = useRef();
  const animationRef = useRef(); // Ref for animation cleanup

  const mapContainerStyle = {
    height: "100vh",
    width: "100%",
  };

  const center = {
    lat: 37.7749, // San Francisco (example)
    lng: -122.4194,
  };

  const onLoadError = useCallback((error) => {
    console.error("Google Maps load error:", error);
    setMapError(true);
  }, []);

  const onLoad = useCallback(() => {
    console.log("Google Maps API loaded successfully");
    setMapLoaded(true);
  }, []);

  // Simulate moving cars using native React with bounds checking and Tailwind-enhanced visuals
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) {
      console.log("Map not loaded or mapRef not set, skipping animation");
      return;
    }

    console.log("Starting car movement animation...");
    const mapBounds = mapRef.current.getBounds(); // Get map bounds to keep cars within view

    animationRef.current = setInterval(() => {
      setCarPositions(prevPositions => {
        const newPositions = prevPositions.map(pos => {
          let newLat = pos.lat + (Math.random() - 0.5) * 0.001;
          let newLng = pos.lng + (Math.random() - 0.5) * 0.001;

          // Keep cars within map bounds
          if (mapBounds) {
            const ne = mapBounds.getNorthEast(); // NorthEast corner
            const sw = mapBounds.getSouthWest(); // SouthWest corner

            newLat = Math.max(sw.lat(), Math.min(ne.lat(), newLat));
            newLng = Math.max(sw.lng(), Math.min(ne.lng(), newLng));
          }

          return { lat: newLat, lng: newLng };
        });

        console.log("Updated car positions:", newPositions);
        return newPositions;
      });
    }, 2000); // Update every 2 seconds for smooth movement

    return () => {
      console.log("Cleaning up car movement animation...");
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [mapLoaded]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-500">
        Failed to load Google Maps. Please check your API key or network connection.
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
      onError={onLoadError}
      onLoad={onLoad}
    >
      <div className="relative w-full h-screen overflow-hidden">
        {!mapLoaded ? (
          <div className="flex items-center justify-center min-h-screen bg-white">
            Loading Map...
          </div>
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              options={{
                styles: [
                  {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ saturation: -100 }],
                  },
                ],
                disableDefaultUI: true,
                mapTypeControl: false,
              }}
              onLoad={(map) => {
                console.log("Map loaded, setting mapRef...");
                mapRef.current = map;
              }}
              onUnmount={() => console.log("Map unmounted")}
              className="animate-pulse" // Tailwind pulse animation for the map
            >
              {carPositions.map((position, index) => (
                <Marker
                  key={index}
                  position={position}
                  icon={{
                    url: "https://img.icons8.com/?size=512&id=1378&format=png", // Car icon URL (replace with asset or CDN)
                    scaledSize: new window.google.maps.Size(40, 40),
                    // Use Tailwind-inspired classes indirectly via custom styling (via CSS)
                  }}
                />
              ))}
            </GoogleMap>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute top-4 left-4 bg-e-ride-green/20 p-4 rounded-full">
                <FaCar size={48} className="text-yellow-500 animate-bounce" />
              </div>

              <div className="text-center max-w-xl px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  Ride Green, Ride Smart
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200 drop-shadow-md">
                  Book eco-friendly rides with seamless navigation, secure bookings, and real-time tracking. Join the future of transportation today!
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="bg-e-ride-purple hover:bg-purple-700 text-white rounded-full px-8 py-3 text-lg font-medium shadow-lg"
                    href="/onboarding1"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="bg-white text-e-ride-purple border-e-ride-purple hover:bg-purple-100 rounded-full px-8 py-3 text-lg font-medium shadow-lg"
                    href="/login"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 text-sm text-gray-200">
              © 2025 E-Ride. All rights reserved.
            </div>
          </>
        )}
      </div>
    </LoadScript>
  );
};

// Add Tailwind animations
const styles = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .animate-pulse {
    animation: pulse 2s infinite ease-in-out;
  }

  .animate-bounce {
    animation: bounce 2s infinite ease-in-out;
  }
`;

export default LandingPage;