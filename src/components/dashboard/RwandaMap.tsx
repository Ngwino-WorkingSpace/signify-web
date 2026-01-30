import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DistrictData {
  name: string;
  lat: number;
  lng: number;
  responses: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface RwandaMapProps {
  districtData?: DistrictData[];
  loading?: boolean;
  onDistrictClick?: (districtName: string) => void;
}

// Rwanda district coordinates
const RWANDA_DISTRICTS: Record<string, { lat: number; lng: number }> = {
  'Gasabo': { lat: -1.9536, lng: 30.0605 },
  'Kicukiro': { lat: -1.9999, lng: 30.1267 },
  'Nyarugenge': { lat: -1.9441, lng: 30.0619 },
  'Muhanga': { lat: -2.1978, lng: 29.7469 },
  'Rulindo': { lat: -1.8333, lng: 30.2167 },
  'Rubavu': { lat: -1.9444, lng: 29.2919 },
  'Rusizi': { lat: -2.4594, lng: 29.0094 },
  'Musanze': { lat: -1.5077, lng: 29.6333 },
  'Gicumbi': { lat: -1.5667, lng: 30.1333 },
  'Gakenke': { lat: -1.6833, lng: 29.8833 },
  'Karongi': { lat: -2.1167, lng: 29.3833 },
  'Ngororero': { lat: -1.8500, lng: 29.6333 },
  'Nyabihu': { lat: -1.7167, lng: 29.6000 },
  'Rutsiro': { lat: -2.1333, lng: 29.3333 },
  'Nyanza': { lat: -2.3500, lng: 29.7333 },
  'Huye': { lat: -2.6000, lng: 29.7500 },
  'Nyamagabe': { lat: -2.7833, lng: 29.5500 },
  'Nyaruguru': { lat: -2.8167, lng: 29.6000 },
  'Gisagara': { lat: -2.6000, lng: 29.8833 },
  'Kamonyi': { lat: -2.0833, lng: 29.9500 },
  'Ruhango': { lat: -2.2167, lng: 29.7833 },
  'Bugesera': { lat: -2.1833, lng: 30.1333 },
  'Gatsibo': { lat: -1.6167, lng: 30.4333 },
  'Kayonza': { lat: -1.8333, lng: 30.3500 },
  'Kirehe': { lat: -2.2167, lng: 30.6833 },
  'Ngoma': { lat: -2.1333, lng: 30.5000 },
  'Nyagatare': { lat: -1.3000, lng: 30.4000 },
  'Rwamagana': { lat: -1.9500, lng: 30.4333 },
};

const RwandaMap: React.FC<RwandaMapProps> = ({ 
  districtData = [], 
  loading = false,
  onDistrictClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Calculate risk level based on response count (can be customized)
  const calculateRiskLevel = (responses: number, totalResponses: number): 'low' | 'medium' | 'high' => {
    const percentage = totalResponses > 0 ? (responses / totalResponses) * 100 : 0;
    if (percentage > 20) return 'high';
    if (percentage > 10) return 'medium';
    return 'low';
  };

  // Prepare district data with coordinates and risk levels
  const prepareDistrictData = (): DistrictData[] => {
    console.log('🗺️ Preparing district data from:', districtData);
    
    const totalResponses = districtData.reduce((sum, district) => sum + (district.value || 0), 0);
    console.log('📊 Total responses:', totalResponses);
    
    const processed = districtData.map(district => {
      const coords = RWANDA_DISTRICTS[district.name];
      console.log(`📍 Processing ${district.name}:`, { coords, value: district.value });
      
      if (!coords) {
        console.warn(`⚠️ No coordinates found for district: ${district.name}`);
        return null;
      }
      
      return {
        name: district.name,
        lat: coords.lat,
        lng: coords.lng,
        responses: district.value || 0,
        riskLevel: calculateRiskLevel(district.value || 0, totalResponses)
      };
    }).filter(Boolean) as DistrictData[];

    console.log('✅ Final processed district data:', processed);
    return processed;
  };

  useEffect(() => {
    if (!mapRef.current || loading) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map centered on Rwanda
    const map = L.map(mapRef.current).setView([-1.9403, 29.8739], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get processed district data
    const processedDistrictData = prepareDistrictData();

    // Add markers for each district
    processedDistrictData.forEach(district => {
      const color = district.riskLevel === 'high' ? '#ef4444' : 
                   district.riskLevel === 'medium' ? '#eab308' : '#22c55e';

      const circle = L.circleMarker([district.lat, district.lng], {
        radius: Math.max(Math.sqrt(district.responses) * 2, 8), // Minimum radius for visibility
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.5
      }).addTo(map);

      // Enhanced popup with click action
      circle.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #18392b;">${district.name}</h4>
          <p style="margin: 4px 0;"><strong>Responses:</strong> ${district.responses.toLocaleString()}</p>
          <p style="margin: 4px 0;"><strong>Risk Level:</strong> 
            <span style="color: ${color}; font-weight: bold;">${district.riskLevel.toUpperCase()}</span>
          </p>
          <button 
            onclick="window.viewDistrictDetails('${district.name}')" 
            style="margin-top: 8px; padding: 4px 8px; background: #18392b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            View Details
          </button>
        </div>
      `);

      // Add tooltip
      circle.bindTooltip(`${district.name}: ${district.responses.toLocaleString()} responses`, {
        permanent: false,
        direction: 'top',
        className: 'district-tooltip'
      });

      // Add hover effects
      circle.on('mouseover', () => {
        setHoveredDistrict(district.name);
        circle.setStyle({
          weight: 3,
          fillOpacity: 0.7
        });
      });

      circle.on('mouseout', () => {
        setHoveredDistrict(null);
        circle.setStyle({
          weight: 2,
          fillOpacity: 0.5
        });
      });

      // Add click handler
      circle.on('click', () => {
        if (onDistrictClick) {
          onDistrictClick(district.name);
        }
      });
    });

    // Global function for popup button clicks
    (window as any).viewDistrictDetails = (districtName: string) => {
      if (onDistrictClick) {
        onDistrictClick(districtName);
      }
    };

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clean up global function
      delete (window as any).viewDistrictDetails;
    };
  }, [districtData, loading, onDistrictClick]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18392b]"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <div className="text-xs font-semibold mb-2 text-gray-700">Risk Levels</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Low Risk (&lt;10%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Medium Risk (10-20%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">High Risk (&gt;20%)</span>
          </div>
        </div>
        {districtData.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {districtData.length} districts active
            </div>
          </div>
        )}
        {hoveredDistrict && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-700 font-medium">
              {hoveredDistrict}
            </div>
            <div className="text-xs text-gray-500">
              Click for details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RwandaMap;
