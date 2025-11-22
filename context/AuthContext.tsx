import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type User = {
  id: number;
  // Add other user fields as needed
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  // Add login/logout functions if needed
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session/token
    const checkAuth = async () => {
      try {
        // Replace with your actual auth check
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch user data from your API
          // const userData = await fetchUserData();
          // setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};