import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  Presentation, 
  File,
  Trash2,
  Search,
  Filter,
  Eye,
  User,
  Building,
  X
} from "lucide-react";

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

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  companyId: string | null;
  companyName: string;
  category: string;
  description: string;
  url: string;
  data: ArrayBuffer;
  base64Data?: string; // For localStorage persistence
}

interface ReportsProps {
  user?: User;
}

// Mock companies data
const companies = [
  { id: "1", name: "TechVision Inc" },
  { id: "2", name: "Global Finance Corp" },
  { id: "3", name: "Retail Solutions Ltd" },
  { id: "4", name: "Manufacturing Pro" }
];

const categories = [
  "Financial Reports",
  "Technical Documentation", 
  "Marketing Materials",
  "Legal Documents",
  "Operational Reports",
  "Strategic Plans",
  "Meeting Minutes",
  "Other"
];

export function Reports({ user }: ReportsProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Auto-select user's company when dialog opens for regular users
  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
    
    // Pre-select user's company for regular users
    if (user && user.role !== 'CEO' && user.role !== "CEO's Secretary" && user.companyId) {
      setUploadForm(prev => ({ ...prev, companyId: user.companyId || '' }));
    }
  };
  const [uploadError, setUploadError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    companyId: '',
    category: '',
    description: ''
  });

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedReports');
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles);
        // Reconstruct ArrayBuffer from base64 data
        const reconstructedFiles = files.map((file: any) => ({
          ...file,
          data: file.base64Data ? 
            Uint8Array.from(atob(file.base64Data), c => c.charCodeAt(0)).buffer : 
            new ArrayBuffer(0),
          url: file.base64Data ? 
            URL.createObjectURL(new Blob([Uint8Array.from(atob(file.base64Data), c => c.charCodeAt(0))], { type: file.type })) :
            file.url
        }));
        setUploadedFiles(reconstructedFiles);
      } catch (error) {
        console.error('Error loading files:', error);
        // Fallback to mock data if localStorage is corrupted
        const mockFiles: UploadedFile[] = [
          {
            id: 'file_demo_1',
            name: 'Q3_Financial_Report.pdf',
            type: 'application/pdf',
            size: 2458976,
            uploadedBy: 'John Smith',
            uploadedAt: '2025-09-15T10:30:00Z',
            companyId: null,
            companyName: 'Holdings',
            category: 'Financial Reports',
            description: 'Quarterly financial performance across all portfolio companies',
            url: 'blob:demo-url-1',
            data: new ArrayBuffer(0)
          }
        ];
        setUploadedFiles(mockFiles);
      }
    } else {
      // Initialize with some mock files for demonstration
      const mockFiles: UploadedFile[] = [
        {
          id: 'file_demo_1',
          name: 'Q3_Financial_Report.pdf',
          type: 'application/pdf',
          size: 2458976,
          uploadedBy: 'John Smith',
          uploadedAt: '2025-09-15T10:30:00Z',
          companyId: null,
          companyName: 'Holdings',
          category: 'Financial Reports',
          description: 'Quarterly financial performance across all portfolio companies',
          url: 'blob:demo-url-1',
          data: new ArrayBuffer(0)
        }
      ];
      setUploadedFiles(mockFiles);
    }
  }, []);

  // Save files to localStorage when files change (excluding ArrayBuffer)
  useEffect(() => {
    const filesForStorage = uploadedFiles.map(file => ({
      ...file,
      data: undefined, // Don't store ArrayBuffer
      url: file.base64Data ? 
        URL.createObjectURL(new Blob([Uint8Array.from(atob(file.base64Data), c => c.charCodeAt(0))], { type: file.type })) :
        file.url
    }));
    localStorage.setItem('uploadedReports', JSON.stringify(filesForStorage));
  }, [uploadedFiles]);

  // File type configurations
  const fileTypeConfig = {
    'application/pdf': { icon: FileText, color: 'text-red-600', name: 'PDF' },
    'application/vnd.ms-powerpoint': { icon: Presentation, color: 'text-orange-600', name: 'PowerPoint' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: Presentation, color: 'text-orange-600', name: 'PowerPoint' },
    'application/msword': { icon: FileText, color: 'text-blue-600', name: 'Word' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-600', name: 'Word' },
    'application/vnd.ms-excel': { icon: FileSpreadsheet, color: 'text-green-600', name: 'Excel' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, color: 'text-green-600', name: 'Excel' },
    'image/jpeg': { icon: Image, color: 'text-purple-600', name: 'JPEG' },
    'image/jpg': { icon: Image, color: 'text-purple-600', name: 'JPG' },
    'image/png': { icon: Image, color: 'text-purple-600', name: 'PNG' },
    'text/plain': { icon: FileText, color: 'text-gray-600', name: 'Text' },
    'application/zip': { icon: File, color: 'text-yellow-600', name: 'ZIP' }
  };

  const getFileIcon = (file: UploadedFile) => {
    const config = fileTypeConfig[file.type as keyof typeof fileTypeConfig];
    return config || { icon: File, color: 'text-gray-600', name: 'File' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !user) {
      setUploadError('Please select a file and ensure you are logged in.');
      return;
    }

    if (!uploadForm.companyId) {
      setUploadError('Please select a company.');
      return;
    }

    if (!uploadForm.category) {
      setUploadError('Please select a category.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const arrayBuffer = await uploadForm.file.arrayBuffer();
      const url = URL.createObjectURL(uploadForm.file);
      
      // Convert ArrayBuffer to base64 for localStorage storage (more robust method)
      let base64 = '';
      try {
        const uint8Array = new Uint8Array(arrayBuffer);
        const chunkSize = 8192; // Process in chunks to avoid stack overflow
        let binaryString = '';
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode(...chunk);
        }
        base64 = btoa(binaryString);
      } catch (base64Error) {
        console.warn('Base64 conversion failed, storing without base64 data:', base64Error);
        // Continue without base64 data for very large files
      }

      const newFile: UploadedFile = {
        id: `file_${Date.now()}`,
        name: uploadForm.file.name,
        type: uploadForm.file.type,
        size: uploadForm.file.size,
        uploadedBy: `${user.firstName} ${user.lastName}`,
        uploadedAt: new Date().toISOString(),
        companyId: uploadForm.companyId === 'holdings' ? null : uploadForm.companyId,
        companyName: uploadForm.companyId === 'holdings' 
          ? 'Holdings'
          : companies.find(c => c.id === uploadForm.companyId)?.name || 'Unknown',
        category: uploadForm.category,
        description: uploadForm.description,
        url,
        data: arrayBuffer,
        base64Data: base64 || undefined
      };

      setUploadedFiles(prev => [newFile, ...prev]);
      
      setUploadForm({
        file: null,
        companyId: '',
        category: '',
        description: ''
      });
      
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const blob = new Blob([file.data], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (file: UploadedFile) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
      const updatedFiles = uploadedFiles.filter(f => f.id !== file.id);
      setUploadedFiles(updatedFiles);
      
      // Update localStorage
      try {
        const filesToSave = updatedFiles.map(f => ({
          ...f,
          data: f.base64Data ? f.base64Data : btoa(String.fromCharCode(...new Uint8Array(f.data)))
        }));
        localStorage.setItem('uploadedReports', JSON.stringify(filesToSave));
      } catch (error) {
        console.error('Error saving files to localStorage:', error);
      }
    }
  };

  const handlePreview = (file: UploadedFile) => {
    window.open(file.url, '_blank');
  };

  const filteredFiles = uploadedFiles.filter(file => {
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !file.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && file.category !== categoryFilter) return false;
    if (companyFilter !== 'all') {
      if (companyFilter === 'holdings' && file.companyId !== null) return false;
      if (companyFilter !== 'holdings' && file.companyId !== companyFilter) return false;
    }
    if (dateFilter !== 'all') {
      const fileDate = new Date(file.uploadedAt);
      if (dateFilter === 'range' && (fileDate < new Date(startDate) || fileDate > new Date(endDate))) return false;
    }
    return true;
  });

  // Group files by category
  const filesByCategory = filteredFiles.reduce((acc, file) => {
    const category = file.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(file);
    return acc;
  }, {} as Record<string, UploadedFile[]>);

  const canUpload = user?.role !== 'Secretary';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'CEO' ? 'Company Reports' : 'Reports & Documents'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'CEO' ? 'Manage documents across your portfolio companies' : 'Upload and manage company documents'}
          </p>
        </div>
        {canUpload && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenUploadDialog}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document to share with your team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select File *</Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-24 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip';
                        input.onchange = handleFileSelect;
                        input.click();
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium">Choose File</p>
                          <p className="text-xs text-muted-foreground">
                            Documents, Images, Archives (Max 50MB)
                          </p>
                        </div>
                      </div>
                    </Button>
                    
                    {uploadForm.file && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const fileConfig = getFileIcon({ type: uploadForm.file.type } as UploadedFile);
                            const IconComponent = fileConfig.icon;
                            return <IconComponent className={`w-5 h-5 ${fileConfig.color}`} />;
                          })()}
                          <div>
                            <p className="text-sm font-medium">{uploadForm.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(uploadForm.file.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company *</Label>
                  {user?.role !== 'CEO' && user?.role !== "CEO's Secretary" && (
                    <p className="text-sm text-gray-500">
                      You can only upload documents for your company: {companies.find(c => c.id === user?.companyId)?.name}
                    </p>
                  )}
                  <Select
                    value={uploadForm.companyId}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, companyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* CEO and CEO's Secretary can upload for any company */}
                      {(user?.role === 'CEO' || user?.role === "CEO's Secretary") && (
                        <SelectItem value="holdings">Holdings (General)</SelectItem>
                      )}
                      {(user?.role === 'CEO' || user?.role === "CEO's Secretary") ? (
                        // Show all companies for CEO and CEO's Secretary
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))
                      ) : (
                        // Regular users can only upload for their own company
                        companies
                          .filter(company => company.id === user?.companyId)
                          .map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={uploadForm.category}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description of the document..."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleUpload}
                    disabled={!uploadForm.file || !uploadForm.category || !uploadForm.companyId || isUploading}
                    className="flex-1"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadForm({ file: null, companyId: '', category: '', description: '' });
                      setUploadError('');
                      setIsUploadDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">Category:</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user?.role === 'CEO' && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Company:</Label>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="holdings">Holdings</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">Date:</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="range">Date Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {dateFilter === 'range' && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/20">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-primary">Select Date Range:</Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">From:</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">To:</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const fileConfig = getFileIcon(file);
              const IconComponent = fileConfig.icon;
              
              return (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-6 h-6 ${fileConfig.color}`} />
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">{file.name}</h3>
                          <p className="text-xs text-muted-foreground">{fileConfig.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building className="w-3 h-3" />
                        {file.companyName}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {file.category}
                      </Badge>
                      {file.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {file.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {file.uploadedBy}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePreview(file)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(file)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredFiles.length === 0 && (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground">
                    {canUpload 
                      ? "Upload your first document to get started."
                      : "No documents available for your access level."
                    }
                  </p>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <div className="divide-y">
              {filteredFiles.map((file) => {
                const fileConfig = getFileIcon(file);
                const IconComponent = fileConfig.icon;
                
                return (
                  <div key={file.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <IconComponent className={`w-8 h-8 ${fileConfig.color} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{file.companyName}</span>
                          <span>{file.category}</span>
                          <span>{file.uploadedBy}</span>
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(file)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {filteredFiles.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground">
                    {canUpload 
                      ? "Upload your first document to get started."
                      : "No documents available for your access level."
                    }
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="mt-6">
          <div className="space-y-6">
            {Object.entries(filesByCategory).map(([category, files]) => {
              const fileList = files as UploadedFile[];
              return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category}
                    <Badge variant="secondary">{fileList.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fileList.map((file) => {
                      const fileConfig = getFileIcon(file);
                      const IconComponent = fileConfig.icon;
                      
                      return (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                          <IconComponent className={`w-6 h-6 ${fileConfig.color} flex-shrink-0`} />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{file.name}</h4>
                            <p className="text-xs text-muted-foreground">{file.companyName}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(file)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(file)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              );
            })}
            
            {Object.keys(filesByCategory).length === 0 && (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  {canUpload 
                    ? "Upload your first document to get started."
                    : "No documents available for your access level."
                  }
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

