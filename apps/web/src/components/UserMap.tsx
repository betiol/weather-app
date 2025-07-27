import React, { useState, useCallback, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { motion } from 'framer-motion';
import { FaMap, FaStreetView, FaMapMarkerAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import type { User } from '@weather/shared-types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MIDDLE_US_COORDS = { lat: 39.8283, lng: -98.5795 }

interface UserMapProps {
  users: User[];
}


interface MarkerProps {
  lat: number;
  lng: number;
  user: User;
  onClick: (user: User) => void;
}

const Marker: React.FC<MarkerProps> = ({ user, onClick, lat, lng }) => {
  useEffect(() => {
    console.log('Rendering marker for user:', user.name, 'at:', { lat, lng });
  }, [user, lat, lng]);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(user);
      }}
      className="cursor-pointer relative group select-none"
      style={{ 
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        zIndex: 1000,
      }}
    >
      <div className="relative">
        <FaMapMarkerAlt 
          className="text-red-500 text-4xl drop-shadow-xl hover:text-red-600 transition-all duration-200 group-hover:scale-110 transform filter"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
          }}
        />
        
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full pointer-events-none"></div>
      </div>
      
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none">
        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1">
          <div className="relative">
            {user?.name || 'Unknown User'} ({lat.toFixed(4)}, {lng.toFixed(4)})
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoWindowProps {
  lat: number;
  lng: number;
  user: User;
  onClose: () => void;
}

const InfoWindowComponent: React.FC<InfoWindowProps> = ({ user, onClose }) => {
  const createStreetViewUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-xl p-3 transform -translate-x-1/2 -translate-y-full mb-2"
      style={{ 
        position: 'absolute',
        zIndex: 1001,
        minWidth: '200px',
        maxWidth: '300px'
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      
      <motion.div className="p-2 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
          <MdLocationOn className="w-4 h-4 text-red-500" />
          {user.name || 'Unknown User'}
        </h3>
        
        <motion.div className="space-y-1 text-sm text-gray-600 mb-3">
          <motion.div>Zip Code: {user.zipCode}</motion.div>
          <motion.div>Coordinates: {user.latitude!.toFixed(4)}, {user.longitude!.toFixed(4)}</motion.div>
          {user.timezone && (
            <motion.div>Timezone: {user.timezone}</motion.div>
          )}
        </motion.div>
        
        <a
          href={createStreetViewUrl(user.latitude!, user.longitude!)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaStreetView className="w-3 h-3" />
          View Street View
        </a>
      </motion.div>
    </motion.div>
  );
};

const UserMap: React.FC<UserMapProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const validUsers = users.filter(user => 
    user.latitude !== undefined && 
    user.longitude !== undefined && 
    !isNaN(user.latitude) && 
    !isNaN(user.longitude)
  );


  const getBoundsZoomLevel = (bounds: any, mapDim: { width: number; height: number }) => {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;
    const ZOOM_MIN = 3;

    const ne = bounds.ne;
    const sw = bounds.sw;

    const latFraction = (ne.lat - sw.lat) / 180;
    const lngFraction = (ne.lng - sw.lng) / 360;

    const latZoom = Math.floor(Math.log(mapDim.height / WORLD_DIM.height / latFraction) / Math.LN2);
    const lngZoom = Math.floor(Math.log(mapDim.width / WORLD_DIM.width / lngFraction) / Math.LN2);

    const zoom = Math.min(Math.min(latZoom, lngZoom), ZOOM_MAX);

    return Math.max(zoom, ZOOM_MIN);
  };

  const getMapBounds = () => {
    if (validUsers.length === 0) {
      return {
        center: MIDDLE_US_COORDS,
        zoom: 4
      };
    }

    const bounds = {
      ne: {
        lat: Math.max(...validUsers.map(u => u.latitude!)),
        lng: Math.max(...validUsers.map(u => u.longitude!))
      },
      sw: {
        lat: Math.min(...validUsers.map(u => u.latitude!)),
        lng: Math.min(...validUsers.map(u => u.longitude!))
      }
    };

    const padding = 0.1;
    const latDiff = (bounds.ne.lat - bounds.sw.lat) * padding;
    const lngDiff = (bounds.ne.lng - bounds.sw.lng) * padding;
    
    bounds.ne.lat += latDiff;
    bounds.ne.lng += lngDiff;
    bounds.sw.lat -= latDiff;
    bounds.sw.lng -= lngDiff;

    const center = {
      lat: (bounds.ne.lat + bounds.sw.lat) / 2,
      lng: (bounds.ne.lng + bounds.sw.lng) / 2
    };

    const zoom = getBoundsZoomLevel(bounds, { width: 800, height: 400 });

    return { center, zoom };
  };

  const handleMarkerClick = (user: User) => {
    setSelectedUser(prev => prev?.id === user.id ? null : user);
  };

  if (validUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center mb-6"
      >
        <motion.div className="text-center">
          <FaMap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No locations to display
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add users with valid zip codes to see them on the map.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const mapSettings = getMapBounds();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative mb-6"
    >
      <motion.div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaMap className="w-5 h-5 text-blue-600" />
          User Locations
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            ({validUsers.length} {validUsers.length === 1 ? 'user' : 'users'})
          </span>
        </h2>
      </motion.div>
      
      <motion.div className="h-64 md:h-72 lg:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 relative">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          defaultCenter={mapSettings.center}
          defaultZoom={mapSettings.zoom}
          yesIWantToUseGoogleMapApiInternals
          options={{
            fullscreenControl: false,
            clickableIcons: false,
          }}
          onClick={() => setSelectedUser(null)}
        >
          {validUsers.map((user) => (
            <Marker
              key={user.id}
              lat={Number(user.latitude)}
              lng={Number(user.longitude)}
              user={user}
              onClick={handleMarkerClick}
            />
          ))}

          {selectedUser && (
            <InfoWindowComponent
              lat={Number(selectedUser.latitude)}
              lng={Number(selectedUser.longitude)}
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </GoogleMapReact>
      </motion.div>
      
      <motion.div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <MdLocationOn className="w-3 h-3" />
        Click on any marker to view details and access Street View
      </motion.div>
    </motion.div>
  );
};

export default UserMap; 