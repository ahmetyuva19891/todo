import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Building2, Plus, Users, Edit, Trash2, UserPlus, UserMinus, Crown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Types to match the registration system
interface RegisteredUser {
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

// Mock data for companies and users
const initialCompanies = [
  {
    id: "1",
    name: "TechVision Inc",
    logo: "https://images.unsplash.com/photo-1746046936818-8d432ebd3d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwY29tcGFueSUyMGxvZ288ZW58MXx8fHwxNzU3ODYzNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Technology and software development company",
    industry: "Technology",
    employees: 45,
    founded: "2020",
    userIds: ["user1", "user2", "user3"]
  },
  {
    id: "2",
    name: "Global Finance Corp",
    logo: "https://images.unsplash.com/photo-1684128169771-f4ff82dffbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwY29ycG9yYXRlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU3OTUzODk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Financial services and investment management",
    industry: "Finance",
    employees: 120,
    founded: "2018",
    userIds: ["user4", "user5", "user6", "user7"]
  },
  {
    id: "3",
    name: "Retail Solutions Ltd",
    logo: "https://images.unsplash.com/photo-1590764095558-abd89de9db5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHNob3BwaW5nfGVufDF8fHx8MTc1Nzk1Mzg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Retail technology and e-commerce solutions",
    industry: "Retail",
    employees: 78,
    founded: "2019",
    userIds: ["user8", "user9", "user10"]
  }
];

const initialUsers = [
  { id: "user1", firstName: "Alex", lastName: "Thompson", email: "alex@techvision.com", role: "CTO", status: "approved", registeredAt: "2020-01-01", companyId: "1", permission: "admin" },
  { id: "user2", firstName: "Sarah", lastName: "Johnson", email: "sarah@techvision.com", role: "Product Manager", status: "approved", registeredAt: "2020-01-01", companyId: "1", permission: "manager" },
  { id: "user3", firstName: "Michael", lastName: "Roberts", email: "michael@techvision.com", role: "Senior Developer", status: "approved", registeredAt: "2020-01-01", companyId: "1", permission: "user" },
  { id: "user4", firstName: "Jennifer", lastName: "Kim", email: "jennifer@globalfinance.com", role: "CFO", status: "approved", registeredAt: "2018-01-01", companyId: "2", permission: "admin" },
  { id: "user5", firstName: "David", lastName: "Park", email: "david@globalfinance.com", role: "Financial Analyst", status: "approved", registeredAt: "2018-01-01", companyId: "2", permission: "manager" },
  { id: "user6", firstName: "Lisa", lastName: "Rodriguez", email: "lisa@globalfinance.com", role: "Investment Manager", status: "approved", registeredAt: "2018-01-01", companyId: "2", permission: "user" },
  { id: "user7", firstName: "Robert", lastName: "Martinez", email: "robert@globalfinance.com", role: "Risk Analyst", status: "approved", registeredAt: "2018-01-01", companyId: "2", permission: "user" },
  { id: "user8", firstName: "Amanda", lastName: "Lee", email: "amanda@retailsolutions.com", role: "Operations Manager", status: "approved", registeredAt: "2019-01-01", companyId: "3", permission: "admin" },
  { id: "user9", firstName: "Carlos", lastName: "Anderson", email: "carlos@retailsolutions.com", role: "Marketing Director", status: "approved", registeredAt: "2019-01-01", companyId: "3", permission: "manager" },
  { id: "user10", firstName: "Emily", lastName: "Davis", email: "emily@retailsolutions.com", role: "UX Designer", status: "approved", registeredAt: "2019-01-01", companyId: "3", permission: "user" },
  { id: "user11", firstName: "Tom", lastName: "Wilson", email: "tom@freelance.com", role: "Consultant", status: "pending", registeredAt: "2021-01-01", companyId: null, permission: null },
  { id: "user12", firstName: "Maria", lastName: "Garcia", email: "maria@contractor.com", role: "Business Analyst", status: "rejected", registeredAt: "2021-01-01", companyId: null, permission: null }
];

export function CompanyManagement() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<typeof initialCompanies[0] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    industry: "",
    logo: ""
  });
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: ""
  });

  // Load users from localStorage on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Load registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // If no users in localStorage, initialize with some sample data
    if (registeredUsers.length === 0) {
      const sampleUsers = initialUsers.map(user => ({
        ...user,
        status: user.status as 'pending' | 'approved' | 'rejected'
      }));
      localStorage.setItem('registeredUsers', JSON.stringify(sampleUsers));
      setUsers(sampleUsers);
    } else {
      setUsers(registeredUsers);
    }
  };

  const saveUsers = (updatedUsers: RegisteredUser[]) => {
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleCreateCompany = () => {
    if (newCompany.name && newCompany.description && newCompany.industry) {
      const company = {
        id: Date.now().toString(),
        ...newCompany,
        employees: 0,
        founded: new Date().getFullYear().toString(),
        userIds: []
      };
      setCompanies([...companies, company]);
      setNewCompany({ name: "", description: "", industry: "", logo: "" });
      setIsCreateCompanyOpen(false);
    }
  };

  const handleCreateUser = () => {
    if (newUser.firstName && newUser.lastName && newUser.email && newUser.role) {
      const user: RegisteredUser = {
        id: `user_${Date.now()}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: 'approved' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: null,
        permission: 'user' as const
      };
      const updatedUsers = [...users, user];
      saveUsers(updatedUsers);
      setNewUser({ firstName: "", lastName: "", email: "", role: "" });
      setIsCreateUserOpen(false);
    }
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(companies.filter(c => c.id !== companyId));
  };

  const handleEditCompany = (company: typeof initialCompanies[0]) => {
    setEditingCompany({ ...company });
    setIsEditCompanyOpen(true);
  };

  const handleSaveCompany = () => {
    if (editingCompany) {
      setCompanies(companies.map(c => 
        c.id === editingCompany.id 
          ? { ...c, ...editingCompany }
          : c
      ));
      setEditingCompany(null);
      setIsEditCompanyOpen(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    // Remove user from all companies
    setCompanies(companies.map(company => ({
      ...company,
      userIds: company.userIds.filter(id => id !== userId)
    })));
  };

  const handleAssignUser = (companyId: string, userId: string) => {
    // Update user's companyId in localStorage
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, companyId } : user
    );
    saveUsers(updatedUsers);
    
    // Update companies state
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, userIds: [...company.userIds, userId] }
        : company
    ));
  };

  const handleUnassignUser = (companyId: string, userId: string) => {
    // Update user's companyId in localStorage
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, companyId: null } : user
    );
    saveUsers(updatedUsers);
    
    // Update companies state
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, userIds: company.userIds.filter(id => id !== userId) }
        : company
    ));
  };

  const getUnassignedUsers = () => {
    return users.filter(user => 
      user.status === 'approved' && (!user.companyId || user.companyId === null)
    );
  };

  const getUsersForCompany = (companyId: string) => {
    return users.filter(user => user.companyId === companyId);
  };

  const getFullName = (user: RegisteredUser) => {
    return `${user.firstName} ${user.lastName}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-600" />
          <div>
            <h1>CEO Dashboard - Company Management</h1>
            <p className="text-muted-foreground">
              Create and manage your portfolio companies and assign team members
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new team member to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-first-name">First Name</Label>
                  <Input
                    id="user-first-name"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="user-last-name">Last Name</Label>
                  <Input
                    id="user-last-name"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="user-role">Role</Label>
                  <Input
                    id="user-role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    placeholder="Enter role/position"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateUserOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                  Add a new company to your portfolio
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="company-description">Description</Label>
                  <Input
                    id="company-description"
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    placeholder="Enter company description"
                  />
                </div>
                <div>
                  <Label htmlFor="company-industry">Industry</Label>
                  <Input
                    id="company-industry"
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    placeholder="Enter industry"
                  />
                </div>
                <div>
                  <Label htmlFor="company-logo">Logo URL (optional)</Label>
                  <Input
                    id="company-logo"
                    value={newCompany.logo}
                    onChange={(e) => setNewCompany({ ...newCompany, logo: e.target.value })}
                    placeholder="Enter logo image URL"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateCompanyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCompany}>
                    Create Company
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
                <DialogDescription>
                  Modify the details of an existing company
                </DialogDescription>
              </DialogHeader>
              {editingCompany && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-company-name">Company Name</Label>
                    <Input
                      id="edit-company-name"
                      value={editingCompany.name}
                      onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-company-description">Description</Label>
                    <Input
                      id="edit-company-description"
                      value={editingCompany.description}
                      onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                      placeholder="Enter company description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-company-industry">Industry</Label>
                    <Input
                      id="edit-company-industry"
                      value={editingCompany.industry}
                      onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
                      placeholder="Enter industry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-company-logo">Logo URL (optional)</Label>
                    <Input
                      id="edit-company-logo"
                      value={editingCompany.logo}
                      onChange={(e) => setEditingCompany({ ...editingCompany, logo: e.target.value })}
                      placeholder="Enter logo image URL"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCompany(null);
                        setIsEditCompanyOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCompany}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {company.logo ? (
                      <ImageWithFallback
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{company.name}</h3>
                      <Badge variant="secondary">{company.industry}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditCompany(company)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Company</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {company.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCompany(company.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{company.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employees:</span>
                    <span>{getUsersForCompany(company.id).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Founded:</span>
                    <span>{company.founded}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.filter(user => user.status === 'approved').map((user) => {
              const assignedCompany = companies.find(c => c.id === user.companyId);
              return (
                <Card key={user.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={undefined} />
                        <AvatarFallback>
                          {getFullName(user).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{getFullName(user)}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {getFullName(user)}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {assignedCompany && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Assigned to: {assignedCompany.name}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {companies.map((company) => (
            <Card key={company.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <ImageWithFallback
                      src={company.logo}
                      alt={company.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  )}
                  <h3 className="font-medium">{company.name}</h3>
                  <Badge variant="secondary">
                    {getUsersForCompany(company.id).length} member{getUsersForCompany(company.id).length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Users
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Users to {company.name}</DialogTitle>
                      <DialogDescription>
                        Select users to assign to this company
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {getUnassignedUsers().map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {getFullName(user).split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{getFullName(user)}</p>
                              <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAssignUser(company.id, user.id)}
                          >
                            Assign
                          </Button>
                        </div>
                      ))}
                      {getUnassignedUsers().length === 0 && (
                        <p className="text-center text-muted-foreground">
                          No unassigned users available
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getUsersForCompany(company.id).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getFullName(user).split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{getFullName(user)}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassignUser(company.id, user.id)}
                    >
                      <UserMinus className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {company.userIds.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-4">
                    No users assigned to this company
                  </p>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}