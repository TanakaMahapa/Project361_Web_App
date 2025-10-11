const API_BASE_URL = 'http://localhost:3002';

export const alertService = {
  // Get all alerts
  async getAlerts(device = null, page = 1, limit = 10) {
    try {
      let url = `${API_BASE_URL}/api/alerts?page=${page}&limit=${limit}`;
      if (device) {
        url += `&device=${device}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Get latest alert for a device
  async getLatestAlert(device) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/latest/${device}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest alert:', error);
      throw error;
    }
  },

  // Create a new alert
  async createAlert(alertData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  // Update alert event
  async updateAlertEvent(device, eventType, timestamp = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/${device}/${eventType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: timestamp || new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  },

  // Get user by username
  async getUser(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create or update user
  async createOrUpdateUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
};
