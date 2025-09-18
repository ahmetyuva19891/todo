import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ErrorBoundary } from "./components/ErrorBoundary";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  companyId?: string | null;
  permission?: 'admin' | 'manager' | 'user';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    // CEO account - always approved
    if (email === 'john@holdings.com' && password === 'demo123') {
      const userData = {
        id: 'user1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@holdings.com',
        role: 'CEO',
        status: 'approved' as const,
        registeredAt: '2020-01-15',
        companyId: null,
        permission: 'admin' as const
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return;
    }

    // Secretary account - for testing
    if (email === 'sarah@holdings.com' && password === 'demo123') {
      const userData = {
        id: 'secretary1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@holdings.com',
        role: 'Secretary',
        status: 'approved' as const,
        registeredAt: '2020-01-15',
        companyId: null,
        permission: 'user' as const
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return;
    }

    // TechVision Manager account - for testing
    if (email === 'mike@techvision.com' && password === 'demo123') {
      const userData = {
        id: 'tv_manager1',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike@techvision.com',
        role: 'Manager',
        status: 'approved' as const,
        registeredAt: '2020-01-15',
        companyId: '1',
        permission: 'manager' as const
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return;
    }

    // Check for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = registeredUsers.find((u: User) => u.email === email);
    
    if (foundUser) {
      if (foundUser.status === 'pending') {
        alert('Your account is pending approval by the CEO. Please wait for approval before accessing the system.');
        return;
      } else if (foundUser.status === 'rejected') {
        alert('Your account has been rejected. Please contact the administrator.');
        return;
      } else if (foundUser.status === 'approved') {
        // For demo purposes, we'll assume password is correct
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return;
      }
    }

    alert('Invalid credentials or account not found.');
  };

  const handleRegister = async (firstName: string, lastName: string, email: string, password: string) => {
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: User) => u.email === email);
    
    if (existingUser) {
      alert('An account with this email already exists.');
      return;
    }

    // Create new user with pending status and complete structure
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      role: 'User',
      status: 'pending' as const,
      registeredAt: new Date().toISOString().split('T')[0],
      companyId: null,           // Add missing companyId
      permission: 'user' as const // Add missing permission
    };

    // Add to registered users list
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    alert('Registration successful! Your account is pending approval by the CEO. You will be notified once approved.');
    setAuthMode('login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {user ? (
          <Layout user={user} onLogout={handleLogout} />
        ) : (
          <>
            {authMode === 'login' ? (
              <Login 
                onLogin={handleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <Register 
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}