import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { CalendarIcon, Check, X, Upload, FileText, FileSpreadsheet, Presentation, Trash2 } from "lucide-react";
import { SuccessPopup } from "./SuccessPopup";

interface TodoFormData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | '';
  dueDate: Date | undefined;
  companyId: string;
  assignedTo: string;
  attachments: File[];
}

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

interface AddTodoFormProps {
  currentUser?: User;
  onTodoAdded?: () => void;
  onClose?: () => void;
  onScrollToTop?: () => void;
}

// Mock companies data
const companies = [
  { id: "1", name: "TechVision Inc" },
  { id: "2", name: "Global Finance Corp" },
  { id: "3", name: "Retail Solutions Ltd" },
  { id: "4", name: "Manufacturing Pro" }
];

// Dynamic users - loaded from localStorage
const getAllUsers = (): User[] => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers.filter((user: any) => user.status === 'approved');
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'bg-destructive text-destructive-foreground' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-orange-500 text-white' },
  { value: 'low', label: 'Low Priority', color: 'bg-green-500 text-white' }
];

// File type configurations
const fileTypeConfig = {
  'application/vnd.ms-powerpoint': { icon: Presentation, color: 'text-orange-600', name: 'PowerPoint' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: Presentation, color: 'text-orange-600', name: 'PowerPoint' },
  'application/msword': { icon: FileText, color: 'text-blue-600', name: 'Word' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-600', name: 'Word' },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, color: 'text-green-600', name: 'Excel' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, color: 'text-green-600', name: 'Excel' },
  'image/jpeg': { icon: Image, color: 'text-purple-600', name: 'JPEG' },
  'image/jpg': { icon: Image, color: 'text-purple-600', name: 'JPG' },
  'image/png': { icon: Image, color: 'text-purple-600', name: 'PNG' },
  'image/gif': { icon: Image, color: 'text-purple-600', name: 'GIF' },
  'image/webp': { icon: Image, color: 'text-purple-600', name: 'WebP' },
  'video/mp4': { icon: FileText, color: 'text-indigo-600', name: 'MP4' },
  'video/quicktime': { icon: FileText, color: 'text-indigo-600', name: 'MOV' },
  'video/x-msvideo': { icon: FileText, color: 'text-indigo-600', name: 'AVI' },
  'video/webm': { icon: FileText, color: 'text-indigo-600', name: 'WebM' },
  'application/pdf': { icon: FileText, color: 'text-red-600', name: 'PDF' }
};

const allowedFileTypes = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'application/pdf'
];

const maxFileSize = 10 * 1024 * 1024; // 10MB for documents and images
const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos

export function AddTodoForm(props: AddTodoFormProps) {
  const { currentUser, onTodoAdded } = props;
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: '',
    dueDate: undefined,
    companyId: '',
    assignedTo: '',
    attachments: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Function to clear localStorage and refresh users
  const clearUserCache = () => {
    localStorage.removeItem('registeredUsers');
    window.location.reload();
  };


  // Helper function to get available companies based on user permissions
  const getAvailableCompanies = () => {
    if (!props.currentUser) return [];
    
    // CEO and CEO's Secretary can assign to any company
    if (props.currentUser.role === 'CEO' || props.currentUser.role === "CEO's Secretary") {
      return companies;
    }
    
    // Manager and Secretary can assign within their assigned company
    if ((props.currentUser.role === 'Manager' || props.currentUser.role === 'Secretary') && props.currentUser.companyId) {
      return companies.filter(company => company.id === props.currentUser.companyId);
    }
    
    // Other company users can only assign within their company
    if (props.currentUser.companyId) {
      return companies.filter(company => company.id === props.currentUser.companyId);
    }
    
    return [];
  };

  // Helper function to get available users to assign based on permissions
  const getAvailableUsers = () => {
    if (!props.currentUser) return [];
    
    const allUsers = getAllUsers();
    
    // Remove duplicates based on user ID and also by email as a fallback
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id && u.email === user.email)
    );
    
    // Additional debugging - log if we find duplicates
    const ahmetUsers = uniqueUsers.filter(user => user.firstName === 'ahmet' && user.lastName === 'yuva');
    if (ahmetUsers.length > 1) {
      console.log('Found duplicate ahmet users:', ahmetUsers);
    }
    
    if (props.currentUser.role === 'CEO' || props.currentUser.role === "CEO's Secretary") {
      // CEO and CEO's Secretary can assign to anyone
      return uniqueUsers;
    }
    
    if (props.currentUser.companyId) {
      // Company users can assign to:
      // 1. Internal company users
      // 2. CEO
      // 3. CEO's Secretary
      const companyUsers = uniqueUsers.filter(user => user.companyId === props.currentUser.companyId);
      const ceo = uniqueUsers.find(user => user.role === 'CEO');
      const ceoSecretary = uniqueUsers.find(user => user.role === "CEO's Secretary");
      
      const assignableUsers = [...companyUsers];
      if (ceo) assignableUsers.push(ceo);
      if (ceoSecretary) assignableUsers.push(ceoSecretary);
      
      return assignableUsers;
    }
    
    return [];
  };

  // Helper function to get company name from user
  const getCompanyName = (user: User) => {
    if (!user.companyId) return 'Holdings';
    return companies.find(c => c.id === user.companyId)?.name || 'Unknown';
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    setFileError('');
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setFileError(`${file.name}: File type not supported. Please upload PowerPoint, Word, Excel, or image files.`);
        return;
      }
      
      // Check file size based on file type
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? maxVideoSize : maxFileSize;
      const maxSizeText = isVideo ? '50MB' : '10MB';
      
      if (file.size > maxSize) {
        setFileError(`${file.name}: File size too large. Maximum size is ${maxSizeText}.`);
        return;
      }
      
      // Check for duplicates
      const isDuplicate = formData.attachments.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      );
      
      if (isDuplicate) {
        setFileError(`${file.name}: File already attached.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...validFiles] 
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };


  const getFileIcon = (file: File) => {
    const config = fileTypeConfig[file.type as keyof typeof fileTypeConfig];
    return config || { icon: FileText, color: 'text-gray-600', name: 'File' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create todo object
      const newTodo = {
        id: `todo_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        priority: formData.priority as 'high' | 'medium' | 'low',
        dueDate: formData.dueDate?.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) || '',
        createdDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        createdTime: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        assignedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown',
        assignedTo: formData.assignedTo,
        companyId: formData.companyId,
        companyName: companies.find(c => c.id === formData.companyId)?.name || 'Unknown',
        attachments: formData.attachments.map((file, index) => ({
          id: `att_${index}`,
          name: file.name,
          type: file.type,
          size: file.size
        })),
        completed: false
      };

      // Save to Supabase via API
             const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });

      if (!response.ok) {
        throw new Error('Failed to save todo');
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Scroll dialog to top after a brief delay to ensure popup is rendered
      setTimeout(() => {
        if (props.onScrollToTop) {
          props.onScrollToTop();
        } else {
          // Fallback to window scroll if no dialog scroll function provided
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      
      // Refresh the todos list
      if (onTodoAdded) {
        onTodoAdded();
      }
      
            // Reset form
            setFormData({
              title: '',
              description: '',
              priority: '',
              dueDate: undefined,
              companyId: '',
              assignedTo: '',
              attachments: []
            });
      
    } catch (error) {
      console.error('Error saving todo:', error);
      setIsSubmitting(false);
      // You could add error state handling here
    }
  };

  const isFormValid = formData.title && formData.description && formData.priority && 
                     formData.dueDate && formData.companyId && formData.assignedTo;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          if (props.onClose) {
            props.onClose();
          }
        }}
        title="Success!"
        message="Your todo item is created successfully!"
      />

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Todo</CardTitle>
          <CardDescription>
            Add a new task and assign it to one of your portfolio companies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Todo Title *</Label>
              <Input
                id="title"
                placeholder="Enter a clear, actionable title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about this task..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Priority and Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label>Company *</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCompanies().map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      formData.dueDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, dueDate: date }));
                      setIsCalendarOpen(false); // Auto-close calendar when date is selected
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label>Assigned To *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableUsers().map((member) => (
                    <SelectItem key={member.id} value={member.firstName + ' ' + member.lastName}>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.firstName + ' ' + member.lastName}</span>
                        <span className="text-sm text-muted-foreground">{member.role} • {getCompanyName(member)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Documents</Label>
                <p className="text-sm text-muted-foreground mt-1">Add documents and files to your todo item</p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    handleFileUpload(target.files);
                  };
                  input.click();
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload Documents</span>
                </div>
              </Button>
                
              {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attached Files ({formData.attachments.length})</p>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => {
                      const fileConfig = getFileIcon(file);
                      const IconComponent = fileConfig.icon;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-5 h-5 ${fileConfig.color}`} />
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {fileConfig.name} • {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Todo'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    priority: '',
                    dueDate: undefined,
                    companyId: '',
                    assignedTo: '',
                    attachments: []
                  });
                  setFileError('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={clearUserCache}
                title="Clear user cache to fix duplicate users"
              >
                Clear Cache
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Form Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Effective Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use clear, actionable language in your title</li>
            <li>• Include specific deliverables and expectations in the description</li>
            <li>• Set realistic due dates that account for dependencies</li>
            <li>• Choose priority levels that reflect actual business impact</li>
            <li>• Consider the workload and capacity of the assigned company</li>
          </ul>
        </CardContent>
      </Card>

      {/* File Upload Error */}
      {fileError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-2 pt-6">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{fileError}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}