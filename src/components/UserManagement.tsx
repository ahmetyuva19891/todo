import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Users, UserPlus, Edit, Trash2, Building2, Mail, Crown, Shield, User, Check, UserCheck, Clock, UserX } from "lucide-react";

// User type matching registration system
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

const companies = [
  { id: "1", name: "TechVision Inc" },
  { id: "2", name: "Global Finance Corp" },
  { id: "3", name: "Retail Solutions Ltd" },
  { id: "4", name: "Manufacturing Pro" }
];

const roleOptions = [
  "CEO", "CEO's Secretary", "Manager", "Secretary"
];

const permissionLevels = [
  { value: "admin", label: "Admin", icon: Crown, color: "text-yellow-600" },
  { value: "manager", label: "Manager", icon: Shield, color: "text-blue-600" },
  { value: "user", label: "User", icon: User, color: "text-green-600" }
];

// Custom Role List Selector Component
interface RoleListSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
  placeholder?: string;
}

function RoleListSelector({ selectedRole, onRoleSelect, placeholder = "Select a role" }: RoleListSelectorProps) {
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-48">
        <div className="p-1">
          {!selectedRole && (
            <div className="p-2 text-sm text-muted-foreground italic">
              {placeholder}
            </div>
          )}
          {roleOptions.map((role) => (
            <div
              key={role}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedRole === role ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => onRoleSelect(role)}
            >
              <span className="text-sm">{role}</span>
              {selectedRole === role && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RegisteredUser | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    permission: "user" as const,
    companyId: "none"
  });

  // Load users from localStorage on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Load registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
  };

  const saveUsers = (updatedUsers: RegisteredUser[]) => {
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const resetToOnlyCEO = () => {
    // Reset to only contain the CEO user
    const ceoUser = {
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

    // Reset localStorage to only contain CEO
    const onlyCEO = [ceoUser];
    localStorage.setItem('registeredUsers', JSON.stringify(onlyCEO));
    setUsers(onlyCEO);
  };

  const handleCreateUser = () => {
    if (newUser.firstName && newUser.lastName && newUser.email && newUser.role) {
      const user: RegisteredUser = {
        id: `user_${Date.now()}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: 'approved',
        registeredAt: new Date().toISOString().split('T')[0],
        companyId: newUser.companyId === "none" ? null : newUser.companyId,
        permission: newUser.permission
      };
      
      const updatedUsers = [...users, user];
      saveUsers(updatedUsers);
      setNewUser({ firstName: "", lastName: "", email: "", role: "", permission: "user", companyId: "none" });
      setIsCreateUserOpen(false);
    }
  };

  const handleEditUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
      saveUsers(updatedUsers);
      setEditingUser(null);
      setIsEditUserOpen(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
  };

  const handleChangeUserStatus = (userId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );
    saveUsers(updatedUsers);
  };

  const startEditUser = (user: RegisteredUser) => {
    setEditingUser({ ...user });
    setIsEditUserOpen(true);
  };

  const getCompanyName = (companyId: string | null | undefined) => {
    if (!companyId) return "Unassigned";
    const company = companies.find(c => c.id === companyId);
    return company?.name || "Unknown Company";
  };

  const getPermissionInfo = (permission: string | undefined) => {
    return permissionLevels.find(p => p.value === permission) || permissionLevels[2];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const approvedUsers = users.filter(u => u.status === 'approved');
  const pendingUsers = users.filter(u => u.status === 'pending');
  const rejectedUsers = users.filter(u => u.status === 'rejected');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1>User Management</h1>
            <p className="text-muted-foreground">
              Manage all users across your organization and their permissions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              const data = localStorage.getItem('registeredUsers');
              console.log('Raw localStorage data:', data);
              console.log('Parsed data:', JSON.parse(data || '[]'));
              alert(`Found ${JSON.parse(data || '[]').length} users in localStorage. Check console for details.`);
            }}
          >
            Debug Users
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              if (confirm('This will remove all users except the CEO. Are you sure?')) {
                resetToOnlyCEO();
                alert('All users except CEO have been removed.');
              }
            }}
          >
            Reset to CEO Only
          </Button>
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-user-first-name">First Name</Label>
                  <Input
                    id="new-user-first-name"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-user-last-name">Last Name</Label>
                  <Input
                    id="new-user-last-name"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-user-email">Email</Label>
                  <Input
                    id="new-user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="new-user-role">Role</Label>
                  <RoleListSelector
                    selectedRole={newUser.role}
                    onRoleSelect={(value) => setNewUser({ ...newUser, role: value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-user-permission">Permission Level</Label>
                  <Select value={newUser.permission} onValueChange={(value) => setNewUser({ ...newUser, permission: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {permissionLevels.map((perm) => {
                        const Icon = perm.icon;
                        return (
                          <SelectItem key={perm.value} value={perm.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${perm.color}`} />
                              {perm.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-user-company">Company (Optional)</Label>
                  <Select value={newUser.companyId} onValueChange={(value) => setNewUser({ ...newUser, companyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Company</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="font-medium">{users.length}</p>
            </div>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="font-medium">{pendingUsers.length}</p>
            </div>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="font-medium">{approvedUsers.length}</p>
            </div>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unassigned</p>
              <p className="font-medium">{users.filter(u => !u.companyId).length}</p>
            </div>
            <Building2 className="w-5 h-5 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4">All Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const permissionInfo = getPermissionInfo(user.permission);
                const PermissionIcon = permissionInfo.icon;
                const fullName = `${user.firstName} ${user.lastName}`;
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={undefined} />
                          <AvatarFallback>
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{fullName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role || 'No Role'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {getCompanyName(user.companyId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PermissionIcon className={`w-4 h-4 ${permissionInfo.color}`} />
                        <span className="capitalize">{user.permission || 'user'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.registeredAt)}</TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeUserStatus(user.id, 'approved')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeUserStatus(user.id, 'rejected')}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.email !== 'john@holdings.com' && (
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
                                  Are you sure you want to delete {fullName}? This action cannot be undone.
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
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-user-first-name">First Name</Label>
                <Input
                  id="edit-user-first-name"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-last-name">Last Name</Label>
                <Input
                  id="edit-user-last-name"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-email">Email</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-role">Role</Label>
                <RoleListSelector
                  selectedRole={editingUser.role || ""}
                  onRoleSelect={(value) => setEditingUser({ ...editingUser, role: value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-user-permission">Permission Level</Label>
                <Select 
                  value={editingUser.permission || "user"} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, permission: value as 'admin' | 'manager' | 'user' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionLevels.map((perm) => {
                      const Icon = perm.icon;
                      return (
                        <SelectItem key={perm.value} value={perm.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${perm.color}`} />
                            {perm.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-user-company">Company</Label>
                <Select 
                  value={editingUser.companyId || "none"} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, companyId: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Company</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-user-status">Status</Label>
                <Select 
                  value={editingUser.status} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, status: value as 'pending' | 'approved' | 'rejected' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        Approved
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <UserX className="w-4 h-4 text-red-600" />
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUser}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}