import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SupabaseTest } from "./components/SupabaseTest";

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

  // Create test users for demo purposes
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Create CEO user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.role === 'CEO')) {
      const ceoUser = {
        id: 'ceo_1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'ceo@company.com',
        role: 'CEO',
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: null,
        permission: 'admin' as const
      };
      registeredUsers.push(ceoUser);
    }
    
    // Create Secretary user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.role === 'Secretary')) {
      const secretaryUser = {
        id: 'secretary_1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'secretary@company.com',
        role: 'Secretary',
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: null,
        permission: 'admin' as const
      };
      registeredUsers.push(secretaryUser);
    }
    
    // Create a test company user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.email === 'ahmet@techvision.com')) {
      const companyUser = {
        id: 'user_ahmet',
        firstName: 'ahmet',
        lastName: 'yuva',
        email: 'ahmet@techvision.com',
        role: 'User',
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: '1', // TechVision Inc
        permission: 'user' as const
      };
      registeredUsers.push(companyUser);
    }
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, []);

  const handleLogin = async (email: string, password: string) => {
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
      companyId: '1',           // Assign to TechVision Inc by default
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
          <>
            <SupabaseTest />
            <Layout user={user} onLogout={handleLogout} />
          </>
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