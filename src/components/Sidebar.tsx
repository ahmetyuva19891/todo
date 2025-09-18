import { useState } from "react";
import { 
  Building2, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Settings, 
  Calendar,
  FileText,
  TrendingUp,
  Menu,
  X,
  Crown,
  UserCog,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: User;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, section: 'main' },
  { id: 'companies', label: 'Companies', icon: Building2, section: 'ceo' },
  { id: 'team', label: 'Team', icon: Users, section: 'ceo' },
  { id: 'user-approval', label: 'User Approval', icon: UserCog, section: 'ceo' },
  { id: 'todos', label: 'Todo Items', icon: CheckSquare, section: 'main' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, section: 'main' },
  { id: 'reports', label: 'Reports', icon: FileText, section: 'main' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'main' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'main' },
];

export function Sidebar({ activeSection, onSectionChange, user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if user is CEO
  const isCEO = user.role === 'CEO';
  
  // Filter CEO sections based on user role
  const getFilteredMenuItems = (section: string) => {
    const items = menuItems.filter(item => item.section === section);
    if (section === 'ceo' && !isCEO) {
      return [];
    }
    return items;
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isCollapsed ? 'hidden' : 'block'}`} 
           onClick={() => setIsCollapsed(true)} />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 lg:static lg:translate-x-0 ${
        isCollapsed ? '-translate-x-full lg:w-16' : 'translate-x-0 w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-sidebar-primary" />
                <span className="font-medium text-sidebar-foreground">Holdings</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-4">
              {/* Main Navigation */}
              <div className="space-y-2">
                {menuItems.filter(item => item.section === 'main').map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isCollapsed ? 'px-2' : 'px-3'
                      } ${
                        isActive 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Button>
                  );
                })}
              </div>

              {/* CEO Section */}
              {!isCollapsed && isCEO && getFilteredMenuItems('ceo').length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-sidebar-foreground">CEO Tools</span>
                  </div>
                  {getFilteredMenuItems('ceo').map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 px-3 ${
                          isActive 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                        onClick={() => onSectionChange(item.id)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Collapsed CEO Section */}
              {isCollapsed && isCEO && getFilteredMenuItems('ceo').length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Crown className="w-4 h-4 text-yellow-600" />
                  </div>
                  {getFilteredMenuItems('ceo').map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 px-2 ${
                          isActive 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                        onClick={() => onSectionChange(item.id)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={undefined} />
                    <AvatarFallback>
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>

                <Separator className="my-2" />

                {/* Version Info */}
                <div className="text-xs text-sidebar-foreground/60">
                  Holdings Management System
                  <br />
                  v1.0.0
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-8 h-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  );
}