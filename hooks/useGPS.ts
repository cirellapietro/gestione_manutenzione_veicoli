
import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  latitude: number;
  longitude: number;
}

interface GPSState {
  isTracking: boolean;
  distance: number;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  permissionStatus: PermissionState | 'not_supported';
}

const toRadians = (degree: number): number => {
    return degree * Math.PI / 180;
}

const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(pos2.latitude - pos1.latitude);
    const dLon = toRadians(pos2.longitude - pos1.longitude);
    const lat1 = toRadians(pos1.latitude);
    const lat2 = toRadians(pos2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
}

export const useGPS = (): GPSState => {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'not_supported'>('prompt');

  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<Position | null>(null);

  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
        setPermissionStatus('not_supported');
        return;
    }
    const status = await navigator.permissions.query({ name: 'geolocation' });
    setPermissionStatus(status.state);
    status.onchange = () => setPermissionStatus(status.state);
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);


  const startTracking = () => {
    if (!navigator.geolocation) {
        setError("Geolocalizzazione non supportata da questo browser.");
        return;
    }

    if (permissionStatus === 'denied') {
        setError("Permesso di geolocalizzazione negato. Abilitalo nelle impostazioni del browser.");
        return;
    }

    setIsTracking(true);
    setError(null);
    lastPosition.current = null; // Reset position on start

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        if (lastPosition.current) {
          setDistance(prevDistance => prevDistance + calculateDistance(lastPosition.current!, newPosition));
        }
        lastPosition.current = newPosition;
      },
      (err) => {
        setError(`Errore GPS: ${err.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
  };

  return { isTracking, distance, error, startTracking, stopTracking, permissionStatus };
};
