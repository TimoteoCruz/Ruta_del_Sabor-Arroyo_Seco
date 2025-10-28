import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded credentials (temporary)
const MOCK_CREDENTIALS = {
  email: 'admin@arroyoseco.com',
  password: 'admin123'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        const storedToken = sessionStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('authUser');
        sessionStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validate credentials
      if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
        const mockUser = {
          id: 1,
          name: 'Administrador',
          email: email,
          role: 'admin'
        };

        const mockToken = btoa(`${email}:${Date.now()}`);

        // Save to localStorage and sessionStorage
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        sessionStorage.setItem('authToken', mockToken);
        
        setUser(mockUser);
        return { success: true, user: mockUser };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};