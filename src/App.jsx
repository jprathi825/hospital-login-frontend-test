import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [token, setToken] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }
  try {
    setLoading(true);
    setError("");

    const loginRes = await axios.post(`${API_URL}/api/login`, {
      email,
      password,
    });
    
    const authToken = loginRes.data.token;
    setToken(authToken);
    
    const profileRes = await axios.get(`${API_URL}/api/profile`, {
      headers: {
        Authorization: authToken,
      },
    });
    
    setProfile(profileRes.data);
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    setError(err.response?.data || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

const handleLogout = () => {
  setProfile(null);
  setEmail("");
  setPassword("");
  setError("");
  setToken("");
  setAllUsers([]);
  setShowAllUsers(false);
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !loading) {
    handleLogin();
  }
};

const handleShowAllProfiles = async () => {
  try {
    setLoadingUsers(true);
    
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: token,
      },
    });
    
    setAllUsers(response.data);
    setShowAllUsers(true);
  } catch (err) {
    console.error("Error fetching users:", err);
    setError("Failed to fetch users");
  } finally {
    setLoadingUsers(false);
  }
};

const handleBackToProfile = () => {setShowAllUsers(false); };
  
  return (
    <div className="app-container">
      {/* Animated background blobs */}
      <div className="background-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {!profile ? (
        <div className="login-card">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <h2 className="title">Hospital Login</h2>
          <p className="subtitle">Welcome back! Please login to continue</p>

          <div className="form-container">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="john@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="input-field"
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </div>
        </div>
      ) : !showAllUsers ? (
        <div className="profile-card">
          {/* Success Icon */}
          <div className="success-icon-container">
            <div className="success-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="title">Welcome Back!</h2>
          <p className="subtitle">Profile Details</p>

          <div className="profile-details">
            <div className="profile-item profile-item-blue">
              <div className="profile-icon profile-icon-blue">
                <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="profile-label">Name</p>
                <p className="profile-value">{profile.name}</p>
              </div>
            </div>

            <div className="profile-item profile-item-purple">
              <div className="profile-icon profile-icon-purple">
                <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="profile-label">Email</p>
                <p className="profile-value">{profile.email}</p>
              </div>
            </div>

            <div className="profile-item profile-item-green">
              <div className="profile-icon profile-icon-green">
                <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="profile-label">Phone</p>
                <p className="profile-value">{profile.phone}</p>
              </div>
            </div>

            <div className="profile-item profile-item-orange">
              <div className="profile-icon profile-icon-orange">
                <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="profile-label">Role</p>
                <p className="profile-value">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Admin Only Button */}
          {profile.role === "admin" && (
            <button onClick={handleShowAllProfiles} disabled={loadingUsers} className="admin-button">
              {loadingUsers ? (
                <>
                  <div className="spinner"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Show All Profiles</span>
                </>
              )}
            </button>
          )}

          <button onClick={handleLogout} className="logout-button">
            <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      ) : (
        // All Users View (Admin Only)
        <div className="all-users-card">
          <div className="all-users-header">
            <button onClick={handleBackToProfile} className="back-button">
              <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Profile</span>
            </button>
            <h2 className="all-users-title">All Profiles ({allUsers.length})</h2>
          </div>

          <div className="users-grid">
            {allUsers.map((user, index) => (
              <div key={user._id || index} className="user-card">
                <div className="user-card-header">
                  <div className={`user-avatar ${user.role === 'admin' ? 'avatar-admin' : 'avatar-doctor'}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`role-badge ${user.role === 'admin' ? 'badge-admin' : 'badge-doctor'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="user-card-body">
                  <h3 className="user-name">{user.name}</h3>
                  <div className="user-info">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{user.email}</span>
                  </div>
                  <div className="user-info">
                    <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} className="logout-button logout-button-bottom">
            <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
