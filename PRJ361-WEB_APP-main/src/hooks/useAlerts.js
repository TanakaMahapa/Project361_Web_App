import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3002';

export const useAlerts = (device = 'laptop') => {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Fetch alerts from API
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/alerts?device=${device}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [device]);

  // Fetch latest alert
  const fetchLatestAlert = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/latest/${device}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setLatestAlert(null);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const alert = await response.json();
      setLatestAlert(alert);
    } catch (err) {
      console.error('Error fetching latest alert:', err);
      setError(err.message);
    }
  }, [device]);

  // Update alert event
  const updateAlertEvent = useCallback(async (eventType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/${device}/${eventType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedAlert = await response.json();
      setLatestAlert(updatedAlert);
      
      // Refresh alerts list
      await fetchAlerts();
      
      return updatedAlert;
    } catch (err) {
      console.error('Error updating alert:', err);
      setError(err.message);
      throw err;
    }
  }, [device, fetchAlerts]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server via Socket.IO');
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err);
      setError('Failed to connect to server');
    });

    // Listen for real-time alert updates
    newSocket.on('alertUpdate', (data) => {
      console.log('📩 Received alert update:', data);
      
      if (data.device === device) {
        setLatestAlert(data.alert);
        
        // Update alerts list
        setAlerts(prevAlerts => {
          const existingIndex = prevAlerts.findIndex(alert => alert._id === data.alert._id);
          
          if (existingIndex >= 0) {
            // Update existing alert
            const newAlerts = [...prevAlerts];
            newAlerts[existingIndex] = data.alert;
            return newAlerts;
          } else {
            // Add new alert
            return [data.alert, ...prevAlerts];
          }
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [device]);

  // Initial data fetch
  useEffect(() => {
    fetchAlerts();
    fetchLatestAlert();
  }, [fetchAlerts, fetchLatestAlert]);

  return {
    alerts,
    latestAlert,
    loading,
    error,
    socket,
    updateAlertEvent,
    refetch: fetchAlerts,
    refetchLatest: fetchLatestAlert
  };
};
