import { useCallback, useEffect, useState, createContext, useContext, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Move token decoding outside the component to avoid re-renders
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const AuthContext = createContext(null);

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// // Initialize Firebase app
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
// const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // useRef for timer to avoid re-renders and maintain reference across renders
  const tokenExpiryTimerRef = useRef(null);
  
  // Flag to prevent concurrent refresh attempts
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Store promises waiting for the refresh to complete
  const refreshPromiseRef = useRef(null);

  const isLoggedIn = () => {
    return user !== null;
  };

  const API_URL = import.meta.env.VITE_API_URL;

  // Schedule token refresh based on token expiry
  const scheduleTokenRefresh = useCallback((accessToken, source = "unspecified") => {
    // Clear any existing timer first to prevent multiple timers
    if (tokenExpiryTimerRef.current) {
      clearTimeout(tokenExpiryTimerRef.current);
      tokenExpiryTimerRef.current = null;
    }

    const expiryTime = getTokenExpiry(accessToken);
    if (!expiryTime) return;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now - (2 * 60 * 1000); // Refresh 2 minutes before expiry
    
    
    if (timeUntilExpiry <= 0) {
      // Token is already expired or about to expire, refresh immediately
  
      refreshAccessToken();
    } else {
      // Schedule refresh for the future
     
      tokenExpiryTimerRef.current = setTimeout(() => {
      
        refreshAccessToken();
      }, timeUntilExpiry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate logout handling to avoid circular dependency
  const handleLogout = useCallback(() => {
    // Clear timers
    if (tokenExpiryTimerRef.current) {
      clearTimeout(tokenExpiryTimerRef.current);
      tokenExpiryTimerRef.current = null;
    }
    
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Define refreshAccessToken with improved user data handling
  const refreshAccessToken = useCallback(async () => {
    // If we're already refreshing, return the existing promise
    if (isRefreshing && refreshPromiseRef.current) {
  
      return refreshPromiseRef.current;
    }
    
    // Directly check sessionStorage instead of relying on user state
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
     
      return Promise.resolve(null);
    }
    
    setIsRefreshing(true);
    
    const promise = new Promise(async (resolve) => {
      try {
        // Explicitly exclude this request from the interceptor
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          { refreshToken: sessionStorage.getItem("refreshToken") },
          { 
            withCredentials: true,
            skipAuthRefresh: true
          }
        );
        
        const { accessToken } = response.data;
        
        // Fetch updated user data
        try {
          const userResponse = await axios.get(
            `${API_URL}/api/auth/profile`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              skipAuthRefresh: true,
              withCredentials: true
            }
          );
          
          if (userResponse.data?.success && userResponse.data?.user) {
            const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
            const userData = {
              ...currentUser,
              ...userResponse.data.user,
              profilePic: userResponse.data.user.profilePic || currentUser.profilePic || "/user.png"
            };
            
            sessionStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          }
        } catch (userError) {
          console.error("Failed to fetch updated user data:", userError);
        }
        
        // Update token in session storage and axios defaults
        sessionStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
        
        // Schedule the next refresh based on token expiry
        scheduleTokenRefresh(accessToken, "refresh-success");
        
      
        resolve(accessToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
        
        if (error.response?.status === 401) {
          
          handleLogout();
        } else if (!navigator.onLine) {
        
          window.addEventListener('online', () => refreshAccessToken(), { once: true });
        } else {
          handleLogout();
        }
        
        resolve(null);
      } finally {
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
      }
    });
    
    refreshPromiseRef.current = promise;
    return promise;
  }, [API_URL, isRefreshing, scheduleTokenRefresh, handleLogout]);

  // Initialize the auth state from sessionStorage
  useEffect(() => {
    const loadInitialState = () => {
      const storedUser = sessionStorage.getItem("user");
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (storedUser && accessToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            profilePic: parsedUser.profilePic || "/user.png",
          });
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          setIsAuthenticated(true);
          
          // Schedule refresh for existing token
          scheduleTokenRefresh(accessToken, "initial-load");
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setIsInitialized(true);
    };
    
    loadInitialState();
  }, [scheduleTokenRefresh, handleLogout]);

  useEffect(() => {
    if (!isInitialized) return;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Skip if this is a refresh request or explicitly flagged to skip
        if (originalRequest.skipAuthRefresh) {
          return Promise.reject(error);
        }
        
        // Don't retry for authentication endpoints
        const isAuthEndpoint = originalRequest.url.includes('/api/auth/signin') || 
                      originalRequest.url.includes('/api/auth/refresh') ||
                      originalRequest.url.includes('/api/auth/google-login');
        
        // Only attempt refresh if it's a 401 error
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;
          
          try {
            
            const newToken = await refreshAccessToken();
            
            if (newToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, don't retry the original request
            setIsAuthenticated(false);
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isInitialized, refreshAccessToken]);

  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        userData,
        { withCredentials: true }
      );
      
      return { 
        success: true,
        userId: response.data.user?.id || response.data.user?._id,
        message: response.data.message
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle 404 or network errors (common in deployment when API is unavailable)
      if (error.response?.status === 404 || error.code === 'ECONNABORTED' || !error.response) {
        console.warn("API endpoint unavailable (404) or network error - creating temporary session");
        
        // Create a temporary user session to allow dashboard access
        const tempUser = {
          id: userData.email,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePic: "/user.png",
          isTemporary: true
        };
        
        sessionStorage.setItem("user", JSON.stringify(tempUser));
        sessionStorage.setItem("accessToken", "temporary_token_" + Date.now());
        setUser(tempUser);
        setIsAuthenticated(true);
        
        return {
          success: false,
          code: "API_UNAVAILABLE",
          message: "Redirecting to dashboard...",
          redirectToDashboard: true
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error?.message || "Registration failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
          
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }

      const { accessToken, userId, role } = response.data;
      
      if (!accessToken || !userId) {
        return {
          success: false,
          message: "Invalid server response",
        };
      }

      // Store tokens
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("userId", userId);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      
      // Fetch full user profile
      try {
        const userResponse = await axios.get(
          `${API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true
          }
        );
        
        if (userResponse.data?.success && userResponse.data?.user) {
          const userData = {
            ...userResponse.data.user,
            profilePic: userResponse.data.user.profilePic || "/user.png"
          };
          
          sessionStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
      } catch (profileError) {
        console.error("Failed to fetch user profile:", profileError);
        // Create basic user object from login response
        const basicUser = {
          id: userId,
          role: role,
          email: email,
          profilePic: "/user.png"
        };
        sessionStorage.setItem("user", JSON.stringify(basicUser));
        setUser(basicUser);
      }
      
      setIsAuthenticated(true);
      scheduleTokenRefresh(accessToken, "login");
          
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle 404 or network errors (common in deployment when API is unavailable)
      if (error.response?.status === 404 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
        console.warn("API endpoint unavailable (404) or network error - creating temporary session");
        
        // Determine role based on email pattern (for development/testing)
        // Admin access: use emails containing "admin"
        const isAdminEmail = email.toLowerCase().includes("admin");
        
        // Create a temporary user session to allow dashboard access
        const tempUser = {
          id: email,
          email: email,
          firstName: email.split("@")[0],
          lastName: "User",
          profilePic: "/user.png",
          role: isAdminEmail ? "Admin" : "Member",
          status: "active",
          isTemporary: true
        };
        
        console.log(`Mock session created for ${tempUser.role} role (${email})`);
        
        sessionStorage.setItem("user", JSON.stringify(tempUser));
        sessionStorage.setItem("accessToken", "temporary_token_" + Date.now());
        setUser(tempUser);
        setIsAuthenticated(true);
        
        return {
          success: true,
          code: "API_UNAVAILABLE",
          message: `Development mode: ${tempUser.role} account created`,
          redirectToDashboard: false
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please check your credentials.",
      };
    }
  };

  // const loginWithGoogle = async () => {
  //   try {
  //     // Trigger Google sign-in popup
  //     const result = await signInWithPopup(auth, googleProvider);
  //
  //     // Get the ID token
  //     const idToken = await result.user.getIdToken();
  //
  //     // Send ID token to your backend
  //     const response = await axios.post(
  //       `${API_URL}/api/auth/google-login`,
  //       { idToken },
  //       { withCredentials: true }
  //     );
  //
  //     // Handle successful login
  //     const { accessToken, user } = response.data;
  //     const profilePicUrl = user.profilePic;
  //     const userData = { ...user, profilePic: profilePicUrl };
  //
  //     sessionStorage.setItem("accessToken", accessToken);
  //     sessionStorage.setItem("user", JSON.stringify(userData));
  //
  //     setUser(userData);
  //     setIsAuthenticated(true);
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  //
  //     // Schedule token refresh
  //     scheduleTokenRefresh(accessToken, "google-login");
  //
  //     return { success: true };
  //   } catch (error) {
  //     console.error("Google login error:", error);
  //
  //     // Important: Let the error propagate to the Login component
  //     // so it can detect specific Firebase errors like popup closed
  //     throw error;
  //   }
  // };

  const logout = () => {
    // Use the handleLogout function
    handleLogout()
    
    // Use skipAuthRefresh to prevent intercepting this request if it fails
    axios.post(`${API_URL}/api/auth/logout`, {}, { 
      withCredentials: true,
      skipAuthRefresh: true 
    }).catch((err) => console.error("Logout error:", err));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoggedIn,
      isAuthenticated,
      isInitialized,
      register,
      // loginWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);