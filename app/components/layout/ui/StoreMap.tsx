'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Next.js mein Leaflet icons fix karne ka tareeqa
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Map ko udakar nayi location par le jane wala function
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15, { animate: true, duration: 1.5 });
  return null;
}

export default function StoreMap() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Pune ke default coordinates
  const defaultCenter: [number, number] = [18.5089, 73.8151];

  // Dummy Stores (Backend aane par yeh API se aayenge)
  const stores = [
    { id: 1, name: "Sharma Kirana Store", lat: 18.5100, lng: 73.8160, type: "Grocery" },
    { id: 2, name: "Verma Dairy Farm", lat: 18.5070, lng: 73.8130, type: "Milk & Dairy" },
    { id: 3, name: "Daily Needs Supermart", lat: 18.5095, lng: 73.8120, type: "Supermarket" }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 Asli Location nikalne ka function
  const locateUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          alert("Location access denied! Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  if (!mounted) return <div className="w-full h-full bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center text-yellow-400 font-bold">Loading Live Map...</div>;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Map ke andar Locate Me ka smart button */}
      <button 
        onClick={locateUser}
        className="absolute top-4 right-4 z-[400] bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-black shadow-xl flex items-center gap-2 hover:bg-yellow-500 transition border-2 border-white"
      >
        <MapPin className="w-5 h-5" /> Locate Me
      </button>

      <MapContainer center={userLocation || defaultCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
        {/* Agar location mili, toh camera wahan move karega */}
        {userLocation && <ChangeView center={userLocation} />}
        
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User ki asli location ka Red Marker (agar allow kiya toh) */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>
              <strong className="text-blue-600 font-bold text-lg">You are here!</strong><br/>
              Delivery available in your area.
            </Popup>
          </Marker>
        )}

        {/* Dukano ke Markers */}
        {stores.map((store) => (
          <Marker key={store.id} position={[store.lat, store.lng]} icon={customIcon}>
            <Popup>
              <div className="text-center p-1 w-32">
                <h3 className="font-bold text-blue-900 leading-tight">{store.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{store.type}</p>
                <button className="mt-3 bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-bold w-full hover:bg-blue-700">View Catalog</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}