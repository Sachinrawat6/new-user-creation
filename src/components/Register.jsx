import { useState } from 'react';
import useEmployee from '../hooks/useEmployeeResister';

const Register = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createdUser, setCreatedUser] = useState(null); // ✅ Store created user

  const { createUser } = useEmployee();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Please enter an employee name.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      setCreatedUser(null);

      const response = await createUser(username.trim());

      setMessage({ type: 'success', text: 'User created successfully!' });
      setCreatedUser(response); // ✅ Save response
      setUsername('');

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create user. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md border p-6 rounded-2xl border-gray-200 shadow-sm bg-white">
        <h1 className="text-center font-medium text-2xl mb-6">Create User</h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className="py-3 px-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Enter Employee Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <input
            className={`py-3 px-4 rounded-2xl text-white transition-colors duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 cursor-pointer'
            }`}
            type="submit"
            value={loading ? 'Creating...' : 'Add User'}
            disabled={loading}
          />
        </form>

        {/* Feedback message */}
        {message.text && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm text-center font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ✅ Created user response card */}
        {createdUser && (
          <div className="mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {createdUser.user_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="font-semibold text-blue-900 text-sm">New User Details</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between  pb-1.5">
                <span className="text-gray-600">ID</span>
                <span className="font-medium text-gray-900">
                  {createdUser.Id || createdUser.id || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
