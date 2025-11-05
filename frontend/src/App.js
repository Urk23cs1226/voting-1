import React, { useState } from 'react';
import axios from 'axios'; // Import axios

// --- REAL API Call for Registration ---
const realApiRegister = async (fullName, email, username, password) => {
  try {
    // This URL matches your backend server
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      fullName,
      email,
      username,
      password
    });
    // On success, we just need to pass a success message
    return { message: 'Registration successful! Please log in.' };
  } catch (error) {
    // Re-throw the error message from the backend
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// --- REAL API Call for Login ---
const realApiLogin = async (usernameOrEmail, password) => {
  try {
    // This URL matches your backend server
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usernameOrEmail,
      password
    });
    // The backend sends back user data on success, which we return
    return response.data;
  } catch (error) {
    // Re-throw the error message from the backend
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// --- React Components ---

/**
 * A reusable loading spinner component.
 */
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

/**
 * A reusable form input component.
 */
const FormInput = ({ id, label, type, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

/**
 * Login Page Component
 */
const LoginPage = ({ onNavigate, onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // --- Frontend Validation ---
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // --- Use the REAL API Call ---
      const user = await realApiLogin(usernameOrEmail, password);
      
      onLoginSuccess(user); // Pass user data up to App
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-xl">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            create a new account
          </button>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="usernameOrEmail"
          label="Username or Email"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)} // <-- THE FIX IS HERE
          placeholder="you@example.com"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && (
          <div className="rounded-md bg-red-800 p-3 text-sm text-red-100">
            {error}
          </div>
        )}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Registration Page Component
 */
const RegisterPage = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // --- Frontend Validation ---
    if (!fullName || !email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // --- Use the REAL API Call ---
      const data = await realApiRegister(fullName, email, username, password);

      setSuccess(data.message);
      // Clear form on success
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      
      // After 2 seconds, navigate to login
      setTimeout(() => {
         onNavigate('login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-xl">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Create your new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            sign in to your existing account
          </button>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="fullName"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
        />
        <FormInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <FormInput
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe123"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
        
        {error && (
          <div className="rounded-md bg-red-800 p-3 text-sm text-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-md bg-green-800 p-3 text-sm text-green-100">
            {success}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Dashboard Page Component
 * This is shown after a successful login.
 */
const DashboardPage = ({ user, onLogout }) => {
  return (
    <div className="w-full max-w-2xl space-y-6 rounded-lg bg-gray-800 p-8 text-white shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold">
          Welcome, {user.fullName}!
        </h2>
        <button
            onClick={onLogout}
            className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Logout
          </button>
      </div>
      
      <div className="space-y-4 rounded-md bg-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-200">Your Profile Details:</h3>
        <div className="text-sm">
          <p><span className="font-semibold text-gray-400">User ID:</span> {user._id}</p>
          <p><span className="font-semibold text-gray-400">Username:</span> {user.username}</p>
          <p><span className="font-semibold text-gray-400">Email:</span> {user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">E-Voting Dashboard</h3>
        <p className="text-gray-300">
          This is where your e-voting and opinion polling features will go.
          You can create new polls, view active elections, and see results.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-700 p-4 hover:bg-gray-600 transition-all cursor-pointer">
            <h4 className="font-bold text-lg text-indigo-300">Create New Poll</h4>
            <p className="text-sm text-gray-400">Start a new opinion poll on any topic.</p>
          </div>
          <div className="rounded-lg bg-gray-700 p-4 hover:bg-gray-600 transition-all cursor-pointer">
            <h4 className="font-bold text-lg text-indigo-300">View Active Elections</h4>
            <p className="text-sm text-gray-400">See and vote in elections you are eligible for.</p>
          </div>
        </div>
      </div>
    </div>
  );
};


/**
 * Main App Component
 * This component controls which page is currently visible.
 */
export default function App() {
  // 'login', 'register', or 'dashboard'
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onNavigate={setCurrentPage}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 p-4 font-sans">
      <div className="w-full">
        <header className="absolute top-0 left-0 w-full p-4">
          <h1 className="text-2xl font-bold text-white text-center">
            E-Voting & Polling Platform
          </h1>
        </header>
        {renderPage()}
      </div>
    </div>
  );
}