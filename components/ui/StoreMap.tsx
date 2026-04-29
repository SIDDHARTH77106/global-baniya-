'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const StoreMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map centered on Pune
      const map = L.map(mapRef.current).setView([18.5204, 73.8567], 12);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // 🚀 THE FIX: Custom CSS Marker (No external images, no tracking warnings!)
      const customMarkerIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 20px; 
            height: 20px; 
            background-color: #10b981; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10], // Centers the dot exactly on the location
        popupAnchor: [0, -10] // Opens popup just above the dot
      });

      // Add sample store markers near Pune
      const stores = [
        { lat: 18.5204, lng: 73.8567, name: 'Sharma Kirana' },
        { lat: 18.5300, lng: 73.8667, name: 'Verma Mart' },
        { lat: 18.5100, lng: 73.8467, name: 'Pune Fresh' },
      ];

      stores.forEach(store => {
        // Apply the custom marker icon here
        L.marker([store.lat, store.lng], { icon: customMarkerIcon })
          .addTo(map)
          .bindPopup(`<b style="color: #064e3b; font-size: 14px;">${store.name}</b><br/>Trusted local store.`);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-2xl z-0" />;
};

export default StoreMap;