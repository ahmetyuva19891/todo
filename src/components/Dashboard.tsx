import { useState } from "react";
import { CompanyCard } from "./CompanyCard";
import { TodoItem } from "./TodoItem";
import { CompletedTodoItem } from "./CompletedTodoItem";
import { TodoAnalytics } from "./TodoAnalytics";
import { AddTodoForm } from "./AddTodoForm";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Filter, X, User, BarChart3, CheckCircle } from "lucide-react";

// Mock data
const companies = [
  {
    id: "1",
    name: "TechVision Inc",
    logo: "https://images.unsplash.com/photo-1746046936818-8d432ebd3d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwY29tcGFueSUyMGxvZ288ZW58MXx8fHwxNzU3ODYzNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    todoCount: 3
  },
  {
    id: "2",
    name: "Global Finance Corp",
    logo: "https://images.unsplash.com/photo-1684128169771-f4ff82dffbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwY29ycG9yYXRlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU3OTUzODk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    todoCount: 4
  },
  {
    id: "3",
    name: "Retail Solutions Ltd",
    logo: "https://images.unsplash.com/photo-1590764095558-abd89de9db5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHNob3BwaW5nfGVufDF8fHx8MTc1Nzk1Mzg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    todoCount: 3
  },
  {
    id: "4",
    name: "Manufacturing Pro",
    logo: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW51ZmFjdHVyaW5nJTIwZmFjdG9yeXxlbnwxfHx8fDE3NTc5NTM5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    todoCount: 2
  }
];

// Mock users data
const allUsers = [
  { id: 'ceo', firstName: 'John', lastName: 'Smith', email: 'john@holdings.com', role: 'CEO', companyId: null },
  { id: 'secretary', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@holdings.com', role: 'Secretary', companyId: null },
  
  // TechVision Inc users
  { id: 'tv1', firstName: 'Mike', lastName: 'Chen', email: 'mike@techvision.com', role: 'Manager', companyId: '1' },
  { id: 'tv2', firstName: 'Alex', lastName: 'Thompson', email: 'alex@techvision.com', role: 'Developer', companyId: '1' },
  { id: 'tv3', firstName: 'Emily', lastName: 'Davis', email: 'emily@techvision.com', role: 'Designer', companyId: '1' },
  { id: 'tv4', firstName: 'Amanda', lastName: 'Lee', email: 'amanda@techvision.com', role: 'QA Engineer', companyId: '1' },
  
  // Global Finance Corp users
  { id: 'gfc1', firstName: 'Michael', lastName: 'Roberts', email: 'michael@globalfinance.com', role: 'CFO', companyId: '2' },
  { id: 'gfc2', firstName: 'Robert', lastName: 'Thompson', email: 'robert@globalfinance.com', role: 'Analyst', companyId: '2' },
  { id: 'gfc3', firstName: 'Lisa', lastName: 'Martinez', email: 'lisa@globalfinance.com', role: 'Accountant', companyId: '2' },
  
  // Retail Solutions Ltd users
  { id: 'rsl1', firstName: 'Lisa', lastName: 'Rodriguez', email: 'lisa@retailsolutions.com', role: 'Manager', companyId: '3' },
  { id: 'rsl2', firstName: 'Jennifer', lastName: 'Kim', email: 'jennifer@retailsolutions.com', role: 'Buyer', companyId: '3' },
  { id: 'rsl3', firstName: 'Tom', lastName: 'Wilson', email: 'tom@retailsolutions.com', role: 'Sales Rep', companyId: '3' },
  { id: 'rsl4', firstName: 'Carlos', lastName: 'Anderson', email: 'carlos@retailsolutions.com', role: 'Marketing', companyId: '3' },
  { id: 'rsl5', firstName: 'Amanda', lastName: 'Rodriguez', email: 'amanda.r@retailsolutions.com', role: 'Analyst', companyId: '3' },
  
  // Manufacturing Pro users
  { id: 'mp1', firstName: 'David', lastName: 'Park', email: 'david@manufacturingpro.com', role: 'Manager', companyId: '4' },
  { id: 'mp2', firstName: 'Robert', lastName: 'Martinez', email: 'robert@manufacturingpro.com', role: 'Engineer', companyId: '4' },
  { id: 'mp3', firstName: 'David', lastName: 'Martinez', email: 'david.m@manufacturingpro.com', role: 'Supervisor', companyId: '4' },
];

const todos = [
  {
    id: "1",
    title: "Complete Q4 Financial Report",
    description: "Prepare comprehensive financial analysis and projections for the fourth quarter",
    priority: "high" as const,
    dueDate: "Sept 20, 2025",
    createdDate: "Sept 15, 2025",
    createdTime: "2:30 PM",
    assignedBy: "Sarah Johnson", // CEO's Secretary
    assignedTo: "Michael Roberts", // Global Finance Corp CFO
    companyId: "2", // Global Finance Corp
    companyName: "Global Finance Corp",
    attachments: [
      {
        id: "att1",
        name: "Q3_Financial_Template.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 2458976
      },
      {
        id: "att2",
        name: "Budget_Guidelines.pdf",
        type: "application/pdf",
        size: 1024000
      }
    ]
  },
  {
    id: "2",
    title: "Update Security Protocols",
    description: "Review and implement new cybersecurity measures across all systems",
    priority: "high" as const,
    dueDate: "Sept 16, 2025", // Overdue
    createdDate: "Sept 10, 2025",
    createdTime: "9:15 AM",
    assignedBy: "Mike Chen", // TechVision Manager
    assignedTo: "Alex Thompson", // TechVision Developer
    companyId: "1", // TechVision Inc
    companyName: "TechVision Inc",
    attachments: [
      {
        id: "att3",
        name: "Security_Audit_Report.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3145728
      },
      {
        id: "att4",
        name: "Network_Diagram.png",
        type: "image/png",
        size: 567890
      },
      {
        id: "att5",
        name: "Security_Presentation.pptx",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        size: 8956432
      }
    ]
  },
  {
    id: "3",
    title: "Inventory Management Review",
    description: "Analyze current inventory levels and optimize stock management",
    priority: "medium" as const,
    dueDate: "Sept 25, 2025",
    createdDate: "Sept 18, 2025",
    createdTime: "11:45 AM",
    assignedBy: "Lisa Rodriguez", // Retail Solutions Manager
    assignedTo: "Jennifer Kim", // Retail Solutions Buyer
    companyId: "3", // Retail Solutions Ltd
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "4",
    title: "Equipment Maintenance Schedule",
    description: "Plan and schedule routine maintenance for manufacturing equipment",
    priority: "medium" as const,
    dueDate: "Sept 15, 2025", // Overdue
    createdDate: "Sept 8, 2025",
    createdTime: "3:20 PM",
    assignedBy: "David Park", // Manufacturing Pro Manager
    assignedTo: "Robert Martinez", // Manufacturing Pro Engineer
    companyId: "4", // Manufacturing Pro
    companyName: "Manufacturing Pro"
  },
  {
    id: "5",
    title: "Team Training Session",
    description: "Organize training for new project management software",
    priority: "low" as const,
    dueDate: "Sept 30, 2025",
    createdDate: "Sept 17, 2025",
    createdTime: "4:10 PM",
    assignedBy: "Emily Davis", // TechVision Designer
    assignedTo: "Amanda Lee", // TechVision QA Engineer
    companyId: "1", // TechVision Inc
    companyName: "TechVision Inc"
  },
  {
    id: "6",
    title: "Customer Feedback Analysis",
    description: "Review customer satisfaction surveys and identify improvement areas",
    priority: "medium" as const,
    dueDate: "Sept 28, 2025",
    createdDate: "Sept 16, 2025",
    createdTime: "1:00 PM",
    assignedBy: "Tom Wilson", // Retail Solutions Sales Rep
    assignedTo: "Carlos Anderson", // Retail Solutions Marketing
    companyId: "3", // Retail Solutions Ltd
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "7",
    title: "Strategic Partnership Review",
    description: "Evaluate current partnerships and identify new opportunities for collaboration",
    priority: "high" as const,
    dueDate: "Sept 19, 2025",
    createdDate: "Sept 12, 2025",
    createdTime: "10:30 AM",
    assignedBy: "John Smith", // CEO
    assignedTo: "Michael Roberts", // Global Finance Corp CFO
    companyId: "2", // Global Finance Corp
    companyName: "Global Finance Corp",
    attachments: [
      {
        id: "att6",
        name: "Partnership_Analysis.pptx",
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        size: 4567890
      },
      {
        id: "att7",
        name: "Market_Research_Charts.jpg",
        type: "image/jpeg",
        size: 890765
      }
    ]
  },
  {
    id: "8",
    title: "AI Platform Integration Testing",
    description: "Conduct comprehensive testing of new AI platform integration with existing systems",
    priority: "medium" as const,
    dueDate: "Sept 17, 2025", // Overdue
    createdDate: "Sept 11, 2025",
    createdTime: "8:45 AM",
    assignedBy: "John Smith", // CEO
    assignedTo: "Mike Chen", // TechVision Manager
    companyId: "1", // TechVision Inc
    companyName: "TechVision Inc"
  },
  {
    id: "9",
    title: "Board Meeting Preparation",
    description: "Prepare quarterly board meeting materials and financial presentations",
    priority: "high" as const,
    dueDate: "Sept 21, 2025",
    createdDate: "Sept 14, 2025",
    createdTime: "6:00 PM",
    assignedBy: "Robert Thompson", // Global Finance Analyst
    assignedTo: "John Smith", // CEO
    companyId: null, // CEO task
    companyName: "Holdings"
  },
  {
    id: "10",
    title: "Market Research Analysis",
    description: "Analyze competitor strategies and market trends for retail technology sector",
    priority: "medium" as const,
    dueDate: "Sept 27, 2025",
    createdDate: "Sept 18, 2025",
    createdTime: "7:30 AM",
    assignedBy: "John Smith", // CEO
    assignedTo: "Amanda Rodriguez", // Retail Solutions Analyst
    companyId: "3", // Retail Solutions Ltd
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "11",
    title: "Production Efficiency Optimization",
    description: "Implement new process improvements to increase manufacturing efficiency",
    priority: "low" as const,
    dueDate: "Oct 5, 2025",
    createdDate: "Sept 13, 2025",
    createdTime: "12:15 PM",
    assignedBy: "John Smith", // CEO
    assignedTo: "David Martinez", // Manufacturing Pro Supervisor
    companyId: "4", // Manufacturing Pro
    companyName: "Manufacturing Pro"
  },
  {
    id: "12",
    title: "Investment Portfolio Review",
    description: "Review and rebalance investment portfolio based on Q3 performance metrics",
    priority: "high" as const,
    dueDate: "Sept 14, 2025", // Overdue
    createdDate: "Sept 9, 2025",
    createdTime: "5:45 PM",
    assignedBy: "Lisa Martinez", // Global Finance Accountant
    assignedTo: "John Smith", // CEO
    companyId: null, // CEO task
    companyName: "Holdings",
    attachments: [
      {
        id: "att8",
        name: "Investment_Portfolio_Data.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1547893
      }
    ]
  }
];

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

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdDate?: string;
  createdTime?: string;
  assignedBy: string;
  assignedTo: string;
  companyId?: string | null;
  companyName: string;
  attachments?: Attachment[];
  completed?: boolean;
  completedAt?: string;
  completedBy?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export function Dashboard({ onCompanySelect, user }: { onCompanySelect?: (companyId: string) => void; user?: User }) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  // Separate completed todos from pending todos
  const allTodos = [...todos];
  const pendingTodos = allTodos.filter(todo => !todo.completed);
  const completedTodos = allTodos.filter(todo => todo.completed) as Array<TodoItem & { completed: true; completedAt: string; completedBy: string }>;

  // Helper function to check if a todo is overdue
  const isOverdue = (dueDate: string): boolean => {
    const today = new Date("2025-09-18");
    const due = new Date(dueDate + ", 2025");
    return due < today;
  };

  // Helper function to check if user can view a todo based on permissions
  const canViewTodo = (todo: TodoItem): boolean => {
    if (!user) return false;
    
    const currentUserFullName = `${user.firstName} ${user.lastName}`;
    
    // CEO can see all todos
    if (user.role === 'CEO') return true;
    
    // Secretary can only see CEO's todos
    if (user.role === 'Secretary') {
      return todo.assignedTo === 'John Smith' || todo.assignedBy === 'John Smith';
    }
    
    // Company users can only see their company's todos
    if (user.companyId) {
      return todo.companyId === user.companyId;
    }
    
    return false;
  };

  // Helper function to get visible companies based on user permissions
  const getVisibleCompanies = () => {
    if (!user) return [];
    
    // CEO can see all companies
    if (user.role === 'CEO') return companies;
    
    // Secretary cannot manage companies
    if (user.role === 'Secretary') return [];
    
    // Company users can only see their own company
    if (user.companyId) {
      return companies.filter(company => company.id === user.companyId);
    }
    
    return [];
  };

  // Handle task completion
  const handleCompleteTask = (todoId: string) => {
    const todoIndex = allTodos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1 && user) {
      const updatedTodo = {
        ...allTodos[todoIndex],
        completed: true,
        completedAt: "Sept 18, 2025", // Current date
        completedBy: `${user.firstName} ${user.lastName}`
      };
      
      // In a real app, this would update the backend
      console.log('Task completed:', updatedTodo);
      
      // For demo purposes, show success message
      alert(`Task "${updatedTodo.title}" marked as complete!`);
    }
  };

  const filteredPendingTodos = pendingTodos.filter(todo => {
    // First check if user can view this todo
    if (!canViewTodo(todo)) return false;
    
    // Company filter
    if (selectedCompany) {
      const company = companies.find(c => c.name === todo.companyName);
      if (company?.id !== selectedCompany) return false;
    }

    // Priority filter
    if (priorityFilter && todo.priority !== priorityFilter) {
      return false;
    }

    // Overdue filter
    if (showOverdueOnly && !isOverdue(todo.dueDate)) {
      return false;
    }

    // Show only me filter
    if (showOnlyMe && user) {
      const currentUserFullName = `${user.firstName} ${user.lastName}`;
      if (todo.assignedTo !== currentUserFullName) {
        return false;
      }
    }

    return true;
  });

  const filteredCompletedTodos = completedTodos.filter(todo => {
    // First check if user can view this todo
    if (!canViewTodo(todo)) return false;
    
    // Company filter
    if (selectedCompany) {
      const company = companies.find(c => c.name === todo.companyName);
      if (company?.id !== selectedCompany) return false;
    }

    // Priority filter
    if (priorityFilter && todo.priority !== priorityFilter) {
      return false;
    }

    // Show only me filter (for completed, check both assignedTo and completedBy)
    if (showOnlyMe && user) {
      const currentUserFullName = `${user.firstName} ${user.lastName}`;
      if (todo.assignedTo !== currentUserFullName && todo.completedBy !== currentUserFullName) {
        return false;
      }
    }

    return true;
  });

  const handleCompanyClick = (companyId: string) => {
    if (onCompanySelect) {
      onCompanySelect(companyId);
    } else {
      // Fallback to filter behavior if no navigation handler
      setSelectedCompany(companyId);
    }
  };

  const handleCompanyFilter = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCompany(null);
    setPriorityFilter(null);
    setShowOverdueOnly(false);
    setShowOnlyMe(false);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCompany !== null || priorityFilter !== null || showOverdueOnly || showOnlyMe;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>
            {user?.role === 'CEO' ? 'Holdings Dashboard' : 
             user?.role === 'Secretary' ? 'CEO Task Manager' :
             'Company Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'CEO' ? 'Manage tasks across your portfolio companies' :
             user?.role === 'Secretary' ? 'Manage tasks for the CEO' :
             `Manage tasks for ${getVisibleCompanies()[0]?.name || 'your company'}`}
          </p>
        </div>
        {user?.role !== 'Secretary' && (
          <Dialog open={isAddTodoOpen} onOpenChange={setIsAddTodoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Todo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Todo</DialogTitle>
                <DialogDescription>
                  Add a new task and assign it to one of your portfolio companies.
                </DialogDescription>
              </DialogHeader>
              <AddTodoForm currentUser={user} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Companies Section */}
      {getVisibleCompanies().length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Your Companies</h2>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCompany(null)}
              className={selectedCompany === null ? 'ring-2 ring-primary' : ''}
            >
              All Companies
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getVisibleCompanies().map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                isSelected={selectedCompany === company.id}
                onFilter={() => handleCompanyFilter(company.id)}
                onViewDetail={() => handleCompanyClick(company.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {[selectedCompany, priorityFilter, showOverdueOnly, showOnlyMe].filter(Boolean).length} active
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium whitespace-nowrap">Priority:</Label>
              <Select 
                value={priorityFilter || "all"} 
                onValueChange={(value) => setPriorityFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overdue Filter */}
            <div className="flex items-center gap-2">
              <Label htmlFor="overdue-filter" className="text-sm font-medium whitespace-nowrap">
                Overdue Only:
              </Label>
              <Switch
                id="overdue-filter"
                checked={showOverdueOnly}
                onCheckedChange={setShowOverdueOnly}
              />
            </div>

            {/* Show Only Me Filter */}
            <div className="flex items-center gap-2">
              <Label htmlFor="show-only-me" className="text-sm font-medium whitespace-nowrap flex items-center gap-1">
                <User className="w-3 h-3" />
                Only Me:
              </Label>
              <Switch
                id="show-only-me"
                checked={showOnlyMe}
                onCheckedChange={setShowOnlyMe}
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Pending Tasks ({filteredPendingTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed Tasks ({filteredCompletedTodos.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col gap-1">
                <h2>
                  {showOnlyMe ? `My Todo Items` : 'Todo Items'}
                </h2>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Filtered by:</span>
                    {selectedCompany && (
                      <Badge variant="outline" className="text-xs">
                        {companies.find(c => c.id === selectedCompany)?.name}
                      </Badge>
                    )}
                    {priorityFilter && (
                      <Badge variant="outline" className="text-xs">
                        {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority
                      </Badge>
                    )}
                    {showOverdueOnly && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        Overdue Only
                      </Badge>
                    )}
                    {showOnlyMe && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Only Me
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">
                {filteredPendingTodos.length} item{filteredPendingTodos.length !== 1 ? 's' : ''} 
                {showOnlyMe && user ? ` assigned to ${user.firstName}` : ''}
              </p>
            </div>
            <div className="space-y-3">
              {filteredPendingTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  currentUser={user} 
                  onComplete={handleCompleteTask}
                />
              ))}
              {filteredPendingTodos.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No pending tasks found.</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col gap-1">
                <h2>
                  {showOnlyMe ? `My Completed Tasks` : 'Completed Tasks'}
                </h2>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Filtered by:</span>
                    {selectedCompany && (
                      <Badge variant="outline" className="text-xs">
                        {companies.find(c => c.id === selectedCompany)?.name}
                      </Badge>
                    )}
                    {priorityFilter && (
                      <Badge variant="outline" className="text-xs">
                        {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority
                      </Badge>
                    )}
                    {showOnlyMe && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Only Me
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">
                {filteredCompletedTodos.length} item{filteredCompletedTodos.length !== 1 ? 's' : ''} completed
              </p>
            </div>
            <div className="space-y-3">
              {filteredCompletedTodos.map((todo) => (
                <CompletedTodoItem key={todo.id} todo={todo} />
              ))}
              {filteredCompletedTodos.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No completed tasks found.</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2>Task Analytics</h2>
              <p className="text-muted-foreground">
                Performance insights across your portfolio
              </p>
            </div>
            <TodoAnalytics 
              todos={filteredPendingTodos} 
              completedTodos={filteredCompletedTodos} 
              companies={getVisibleCompanies()}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}