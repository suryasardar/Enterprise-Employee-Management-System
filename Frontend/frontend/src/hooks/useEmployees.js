import { useState, useCallback } from 'react';
import { employeesAPI } from '../api/employees';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const fetchEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await employeesAPI.list(params);
      setEmployees(data.results || data);
      setPagination({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchEmployees = useCallback(async (query) => {
    setLoading(true);
    try {
      const { data } = await employeesAPI.search({ q: query });
      setEmployees(data.results || data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = async (employeeData) => {
    const { data } = await employeesAPI.create(employeeData);
    setEmployees((prev) => [data, ...prev]);
    return data;
  };

  const updateEmployee = async (id, employeeData) => {
    const { data } = await employeesAPI.update(id, employeeData);
    setEmployees((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const terminateEmployee = async (id) => {
    await employeesAPI.terminate(id);
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, is_active: false } : e)));
  };

  return {
    employees, loading, error, pagination,
    fetchEmployees, searchEmployees, createEmployee, updateEmployee, terminateEmployee,
  };
}