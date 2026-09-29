import { useState } from 'react';
import axios from 'axios';
import { NOCODB_BASE_URL, NOCODB_LOCATION_TABLE_ID, NOCODB_TOKEN } from '../constants/index';

const useLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${NOCODB_BASE_URL}/${NOCODB_LOCATION_TABLE_ID}/records`, {
        params: {
          offset: 0,
          limit: 1000,
        },
        headers: {
          'xc-token': `${NOCODB_TOKEN}`,
        },
      });

      setLocations(response.data?.list || []);
    } catch (error) {
      console.error('Error fetching locations:', error);

      setError(error.response?.data?.message || error.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    fetchLocation,
  };
};

export default useLocation;
