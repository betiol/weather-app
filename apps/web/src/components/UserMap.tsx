import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { FaMap, FaStreetView, FaMapMarkerAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import type { User } from '@weather/shared-types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface UserMapProps {
  users: User[];
}

interface CustomMarkerProps {
  user: User;
  onClick: (user: User) => void;
  map: google.maps.Map | null;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const CustomMarker: React.FC<CustomMarkerProps> = ({ user, onClick, map }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  if (!isVisible || !map) {
    return null;
  }

  return (
    <OverlayView
      position={{ lat: user.latitude!, lng: user.longitude! }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -height,
      })}
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          onClick(user);
        }}
        className="cursor-pointer relative group select-none"
        style={{ 
          position: 'absolute',
          zIndex: 1000,
        }}
      >
        <motion.div className="relative">
          <FaMapMarkerAlt 
            className="text-red-500 text-4xl drop-shadow-xl hover:text-red-600 transition-all duration-200 group-hover:scale-110 transform filter"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
            }}
          />
          
          <motion.div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></motion.div>
        </motion.div>
        
        <motion.div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <motion.div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1">
            <motion.div className="relative">
              {user?.name || 'Unknown User'}
              <motion.div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-400 rounded-full opacity-40 animate-ping"></motion.div>
      </motion.div>
    </OverlayView>
  );
};

const UserMap: React.FC<UserMapProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

 
  const validUsers = users.filter(user => 
    user.latitude !== undefined && 
    user.longitude !== undefined && 
    !isNaN(user.latitude) && 
    !isNaN(user.longitude)
  );

 
  const getMapCenter = (): google.maps.LatLngLiteral => {
    if (validUsers.length === 0) {
      return { lat: 39.8283, lng: -98.5795 };
    }
    
    const avgLat = validUsers.reduce((sum, user) => sum + user.latitude!, 0) / validUsers.length;
    const avgLng = validUsers.reduce((sum, user) => sum + user.longitude!, 0) / validUsers.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMapLoaded(false);
  }, []);

  const createStreetViewUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  };

  const handleMarkerClick = (user: User) => {
    setSelectedUser(user);
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

  const mapCenter = getMapCenter();

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
        <LoadScript 
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          loadingElement={
            <motion.div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <motion.div className="flex flex-col items-center gap-4">
                <motion.div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></motion.div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading Google Maps...</span>
              </motion.div>
            </motion.div>
          }
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={4}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              disableDefaultUI: false,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {mapLoaded && (
              <>
                  {validUsers.map((user) => {
                    return (
                      <CustomMarker
                        key={user.id}
                        user={user}
                        onClick={handleMarkerClick}
                        map={map}
                      />
                    );
                  })}
              </>
            )}

            {selectedUser && (
              <InfoWindow
                position={{ lat: selectedUser.latitude!, lng: selectedUser.longitude! }}
                onCloseClick={() => setSelectedUser(null)}
              >
                <motion.div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <MdLocationOn className="w-4 h-4 text-red-500" />
                    {selectedUser.name || 'Unknown User'}
                  </h3>
                  
                  <motion.div className="space-y-1 text-sm text-gray-600 mb-3">
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>Zip Code: {selectedUser.zipCode}</motion.div>
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>Coordinates: {selectedUser.latitude!.toFixed(4)}, {selectedUser.longitude!.toFixed(4)}</motion.div>
                    {selectedUser.timezone && (
                      <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>Timezone: {selectedUser.timezone}</motion.div>
                    )}
                  </motion.div>
                  
                  <a
                    href={createStreetViewUrl(selectedUser.latitude!, selectedUser.longitude!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaStreetView className="w-3 h-3" />
                    View Street View
                  </a>
                </motion.div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </motion.div>
      
      <motion.div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <MdLocationOn className="w-3 h-3" />
        Click on any marker to view details and access Street View
      </motion.div>
      
    </motion.div>
  );
};

export default UserMap; 