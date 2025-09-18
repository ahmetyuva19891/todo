import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { UserCheck, UserX, Clock, Mail, Calendar, Shield } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export function UserApproval() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
    setPendingUsers(registeredUsers.filter((user: User) => user.status === 'pending'));
  };

  const handleApproveUser = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((user: User) => 
      user.id === userId ? { ...user, status: 'approved' as const } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const handleRejectUser = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((user: User) => 
      user.id === userId ? { ...user, status: 'rejected' as const } : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    loadUsers();
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-yellow-600" />
        <div>
          <h1>User Approval</h1>
          <p className="text-muted-foreground">
            Review and approve user registrations for system access
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
              <p className="font-medium">{users.length}</p>
            </div>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="font-medium">{users.filter(u => u.status === 'pending').length}</p>
            </div>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="font-medium">{users.filter(u => u.status === 'approved').length}</p>
            </div>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="font-medium">{users.filter(u => u.status === 'rejected').length}</p>
            </div>
            <UserX className="w-5 h-5 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Pending Users Section */}
      {pendingUsers.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h2>Pending Approvals ({pendingUsers.length})</h2>
            </div>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-yellow-100">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Registered: {formatDate(user.registeredAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve {user.firstName} {user.lastName}? 
                            They will be able to access the system immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleApproveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                          <UserX className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject {user.firstName} {user.lastName}? 
                            They will not be able to access the system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRejectUser(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reject User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* All Users Table */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4">All Registrations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
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
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role || 'User'}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.registeredAt)}</TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRejectUser(user.id)}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}