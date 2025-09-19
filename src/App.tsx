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
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'ceo'>('login');
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
    
    // Create CEO's Secretary user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.role === "CEO's Secretary")) {
      const ceoSecretaryUser = {
        id: 'ceo_secretary_1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'ceo.secretary@company.com',
        role: "CEO's Secretary",
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: null,
        permission: 'admin' as const
      };
      registeredUsers.push(ceoSecretaryUser);
    }
    
    // Create Manager user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.role === 'Manager')) {
      const managerUser = {
        id: 'manager_1',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'manager@company.com',
        role: 'Manager',
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: '1', // TechVision Inc
        permission: 'manager' as const
      };
      registeredUsers.push(managerUser);
    }
    
    // Create Secretary user if it doesn't exist
    if (!registeredUsers.find((u: User) => u.role === 'Secretary')) {
      const secretaryUser = {
        id: 'secretary_1',
        firstName: 'Lisa',
        lastName: 'Martinez',
        email: 'secretary@company.com',
        role: 'Secretary',
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: '2', // Global Finance Corp
        permission: 'user' as const
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
    
    // Remove any duplicate users based on email
    const uniqueUsers = registeredUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.email === user.email)
    );
    
    localStorage.setItem('registeredUsers', JSON.stringify(uniqueUsers));
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

  const handleCEORegister = async (ceoCode: string, firstName: string, lastName: string, email: string, password: string) => {
    // Check CEO code (in production, this would be more secure)
    const validCEOCode = 'CEO2024'; // This should be in environment variables in production
    
    if (ceoCode !== validCEOCode) {
      alert('Invalid CEO registration code. Please contact your system administrator.');
      return;
    }

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: User) => u.email === email);
    
    if (existingUser) {
      alert('An account with this email already exists.');
      return;
    }

    // Create new CEO user with approved status
    const newCEO = {
      id: `ceo_${Date.now()}`,
      firstName,
      lastName,
      email,
      role: 'CEO',
      status: 'approved' as const,
      registeredAt: new Date().toISOString().split('T')[0],
      companyId: null, // CEO can access all companies
      permission: 'admin' as const
    };

    // Add to registered users list
    const updatedUsers = [...registeredUsers, newCEO];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Auto-login the CEO
    setUser(newCEO);
    localStorage.setItem('user', JSON.stringify(newCEO));

    alert('CEO registration successful! You are now logged in.');
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
                onSwitchToCEO={() => setAuthMode('ceo')}
              />
            ) : authMode === 'register' ? (
              <Register 
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
                onSwitchToCEO={() => setAuthMode('ceo')}
              />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                  <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                      CEO Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Register as CEO to access all company data
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            CEO Access Required
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>To register as CEO, you need a special CEO code. Contact your system administrator to get the CEO registration code.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const ceoCode = formData.get('ceoCode') as string;
                      const firstName = formData.get('firstName') as string;
                      const lastName = formData.get('lastName') as string;
                      const email = formData.get('email') as string;
                      const password = formData.get('password') as string;
                      handleCEORegister(ceoCode, firstName, lastName, email, password);
                    }} className="space-y-3">
                      <input
                        name="ceoCode"
                        type="text"
                        placeholder="CEO Registration Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        Register as CEO
                      </button>
                    </form>
                  </div>

                  <div className="text-center space-y-2">
                    <button
                      onClick={() => setAuthMode('login')}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Back to Login
                    </button>
                    <div className="text-xs text-gray-500">
                      Regular user? <button
                        onClick={() => setAuthMode('register')}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Register here
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}