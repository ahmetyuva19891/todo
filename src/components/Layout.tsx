import { useState, Suspense, lazy } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { AddTodoForm } from "./AddTodoForm";
import { CompanyDetail } from "./CompanyDetail";
import { CompanyManagement } from "./CompanyManagement";
import { UserManagement } from "./UserManagement";
import { UserApproval } from "./UserApproval";

// Lazy load the CompanyProfileEditor since it's a heavy component
const CompanyProfileEditor = lazy(() => import("./CompanyProfileEditor").then(module => ({ default: module.CompanyProfileEditor })));

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

interface LayoutProps {
  user: User;
  onLogout: () => void;
}

// Placeholder components for other sections
function CompaniesView() {
  return <CompanyManagement />;
}

function TodosView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>Todo Management</h1>
        <p className="text-muted-foreground">Create and manage todos across all companies.</p>
      </div>
      <AddTodoForm />
    </div>
  );
}

function CalendarView() {
  return (
    <div className="p-6">
      <h1>Calendar</h1>
      <p className="text-muted-foreground">View deadlines and important dates.</p>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="p-6">
      <h1>Reports</h1>
      <p className="text-muted-foreground">Generate and view company reports.</p>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="p-6">
      <h1>Analytics</h1>
      <p className="text-muted-foreground">Analyze performance across your portfolio.</p>
    </div>
  );
}

function TeamView() {
  return <UserManagement />;
}

function UserApprovalView() {
  return <UserApproval />;
}

function SettingsView() {
  return (
    <div className="p-6">
      <h1>Settings</h1>
      <p className="text-muted-foreground">Configure your application settings.</p>
    </div>
  );
}

export function Layout({ user, onLogout }: LayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const handleCompanySelect = (companyId: string) => {
    if (!companyId) return;
    setSelectedCompanyId(companyId);
    setActiveSection('company-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedCompanyId(null);
    setIsEditingCompany(false);
    setActiveSection('dashboard');
  };

  const handleEditCompany = (companyId: string) => {
    if (!companyId) return;
    setSelectedCompanyId(companyId);
    setIsEditingCompany(true);
    setActiveSection('company-edit');
  };

  const handleBackToCompanyDetail = () => {
    setIsEditingCompany(false);
    setActiveSection('company-detail');
  };

  const handleSaveCompany = (companyData: any) => {
    try {
      // Here you would save the company data to your backend or state management
      console.log('Saving company data:', companyData);
      // For now, just go back to the company detail
      setIsEditingCompany(false);
      setActiveSection('company-detail');
    } catch (error) {
      console.error('Error saving company data:', error);
      // Handle error appropriately - could show a toast notification
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onCompanySelect={handleCompanySelect} user={user} />;
      case 'company-detail':
        return selectedCompanyId ? (
          <CompanyDetail 
            companyId={selectedCompanyId} 
            onBack={handleBackToDashboard}
            onEdit={handleEditCompany}
          />
        ) : <Dashboard onCompanySelect={handleCompanySelect} user={user} />; 
      case 'companies':
        return <CompaniesView />;
      case 'todos':
        return <TodosView />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <ReportsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'team':
        return <TeamView />;
      case 'user-approval':
        return <UserApprovalView />;
      case 'settings':
        return <SettingsView />;
      case 'company-edit':
        return selectedCompanyId ? (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          }>
            <CompanyProfileEditor 
              companyId={selectedCompanyId} 
              onSave={handleSaveCompany}
              onBack={handleBackToCompanyDetail}
            />
          </Suspense>
        ) : <Dashboard onCompanySelect={handleCompanySelect} user={user} />; 
      default:
        return <Dashboard onCompanySelect={handleCompanySelect} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}