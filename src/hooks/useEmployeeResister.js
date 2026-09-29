import { useState } from 'react';
import axios from 'axios';
import { NOCODB_BASE_URL, NOCODB_EMPLOYEE_TABLE_ID, NOCODB_TOKEN } from '../constants/index';

const useEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${NOCODB_BASE_URL}/${NOCODB_EMPLOYEE_TABLE_ID}/records`, {
        params: {
          offset: 0,
          limit: 1000,
        },
        headers: {
          'xc-token': `${NOCODB_TOKEN}`,
        },
      });

      setEmployees(response.data?.list || []);
    } catch (error) {
      console.error('Error fetching employees:', error);

      setError(error.response?.data?.message || error.message || 'Failed to fetch emloyees');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user_name) => {
    try {
      const response = await axios.post(
        `${NOCODB_BASE_URL}/${NOCODB_EMPLOYEE_TABLE_ID}/records`,
        {
          user_name,
        },
        {
          headers: {
            'xc-token': `${NOCODB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create user');
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${NOCODB_BASE_URL}/${NOCODB_EMPLOYEE_TABLE_ID}/records`,
        {
          headers: {
            'xc-token': `${NOCODB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: { id },
        }
      );
      console.log('User deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  };
  return {
    employees,
    loading,
    error,
    fetchEmployee,
    createUser,
    deleteUser,
  };
};

export default useEmployee;
