import { useEffect, useState } from 'react';
import useEmployee from '../hooks/useEmployeeResister';

const Users = () => {
  const { employees, fetchEmployee, deleteUser, loading, error } = useEmployee();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'zero' | 'hasScans' | 'deletable'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteUser(id);
      await fetchEmployee();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  // Apply filter + search
  const filteredEmployees = employees?.filter((employee) => {
    const term = searchTerm.toLowerCase();
    const name = employee.user_name?.split(' / ')[0]?.toLowerCase() || '';
    const id = String(employee.id).toLowerCase();
    const location = employee.locations?.toString().toLowerCase() || '';
    const matchesSearch = name.includes(term) || id.includes(term) || location.includes(term);

    const scans = Number(employee.scan_tracking_2s) || 0;
    const hasNoLocation = !employee.locations || String(employee.locations).trim() === '';
    const isDeletable = hasNoLocation && scans === 0;

    let matchesFilter = true;
    if (activeFilter === 'zero') matchesFilter = scans === 0;
    else if (activeFilter === 'hasScans') matchesFilter = scans > 0;
    else if (activeFilter === 'deletable') matchesFilter = isDeletable;

    return matchesSearch && matchesFilter;
  });

  // Filter tab config
  const filterTabs = [
    { key: 'all', label: 'All Users' },
    { key: 'zero', label: '0 Scan Tracking' },
    { key: 'hasScans', label: 'Has Scan Tracking' },
    { key: 'deletable', label: 'Deletable (No Location + 0 Scans)' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-center font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all employees and their scan activity.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, ID, or location..."
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              activeFilter === tab.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table section */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Locations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                All time scan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees?.length > 0 ? (
              filteredEmployees.map((e, i) => {
                const scans = Number(e.scan_tracking_2s) || 0;
                const hasNoLocation = !e.locations || String(e.locations).trim() === '';
                const canDelete = hasNoLocation && scans === 0;
                const isDeleting = deletingId === e.id;

                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {e.user_name?.split(' / ')[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hasNoLocation ? (
                        <span className="text-xs text-gray-400 italic">No location</span>
                      ) : (
                        e.locations
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scans}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {canDelete ? (
                        <button
                          onClick={() => handleDelete(e.id)}
                          disabled={isDeleting}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDeleting
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isDeleting ? (
                            <>
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  {searchTerm
                    ? 'No employees found matching your search.'
                    : 'No employees data available for this filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      {filteredEmployees?.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}
    </div>
  );
};

export default Users;
