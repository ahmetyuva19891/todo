import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Clock, Calendar, User, CalendarClock, Download, FileText, Image, FileSpreadsheet, Presentation, Paperclip } from "lucide-react";
import { memo } from "react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdDate?: string; // Add optional created date
  createdTime?: string; // Add optional created time
  assignedBy: string;
  assignedTo: string;
  companyName: string;
  attachments?: Attachment[]; // Add attachments
  completed?: boolean; // Add completion status
  completedAt?: string; // Add completion date
  completedBy?: string; // Add who completed it
}

interface TodoItemProps {
  todo: TodoItem;
  currentUser?: {
    firstName: string;
    lastName: string;
    role?: string;
  };
  onComplete?: (todoId: string) => void;
}

const priorityColors = {
  high: 'bg-destructive text-destructive-foreground',
  medium: 'bg-orange-500 text-white',
  low: 'bg-green-500 text-white'
};

// File type configurations for attachments
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
  'application/pdf': { icon: FileText, color: 'text-red-600', name: 'PDF' }
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string, timeString?: string): string => {
  const today = new Date("2025-09-18");
  const targetDate = new Date(dateString + ", 2025");
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return timeString ? `Today at ${timeString}` : 'Today';
  if (diffDays === 1) return timeString ? `Tomorrow at ${timeString}` : 'Tomorrow';
  if (diffDays === -1) return timeString ? `Yesterday at ${timeString}` : 'Yesterday';
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

// Helper function to format created date/time for display
const formatCreatedDateTime = (createdDate?: string, createdTime?: string): string => {
  if (!createdDate) return 'Recently created';
  
  const today = new Date("2025-09-18");
  const created = new Date(createdDate + ", 2025");
  const diffTime = today.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return createdTime ? `Created today at ${createdTime}` : 'Created today';
  if (diffDays === 1) return createdTime ? `Created yesterday at ${createdTime}` : 'Created yesterday';
  if (diffDays > 1) return `Created ${diffDays} days ago`;
  return createdDate + (createdTime ? ` at ${createdTime}` : '');
};

// Helper function to check if a todo is overdue
const isOverdue = (dueDate: string): boolean => {
  const today = new Date("2025-09-18"); // Current date from system
  const due = new Date(dueDate + ", 2025"); // Parse the date string
  return due < today;
};

// Helper function to get file icon and styling
const getFileIcon = (fileType: string) => {
  const config = fileTypeConfig[fileType as keyof typeof fileTypeConfig];
  return config || { icon: FileText, color: 'text-gray-600', name: 'File' };
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to download a file
const downloadFile = (attachment: Attachment) => {
  try {
    let content: string;
    let mimeType: string;
    
    // Create content based on file type
    if (attachment.type.includes('pdf')) {
      content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Demo PDF: ${attachment.name}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;
      mimeType = 'application/pdf';
    } else if (attachment.type.includes('excel') || attachment.type.includes('spreadsheet')) {
      content = `File: ${attachment.name}
Type: ${attachment.type}
Size: ${formatFileSize(attachment.size)}

This is a demo Excel file. In a real application, this would be the actual spreadsheet data.

Column A    Column B    Column C
Data 1      Data 2      Data 3
Value 1     Value 2     Value 3`;
      mimeType = 'text/csv';
    } else if (attachment.type.includes('word') || attachment.type.includes('document')) {
      content = `File: ${attachment.name}
Type: ${attachment.type}
Size: ${formatFileSize(attachment.size)}

This is a demo Word document. In a real application, this would be the actual document content.

# Document Title

## Section 1
This is a sample document with formatted text.

## Section 2
- Bullet point 1
- Bullet point 2
- Bullet point 3

**Bold text** and *italic text* are supported.`;
      mimeType = 'text/plain';
    } else if (attachment.type.includes('powerpoint') || attachment.type.includes('presentation')) {
      content = `File: ${attachment.name}
Type: ${attachment.type}
Size: ${formatFileSize(attachment.size)}

This is a demo PowerPoint presentation. In a real application, this would be the actual presentation slides.

Slide 1: Title Slide
- Main Title: ${attachment.name}
- Subtitle: Demo Presentation

Slide 2: Content Slide
- Point 1: Important information
- Point 2: Key details
- Point 3: Additional notes

Slide 3: Conclusion
- Summary of main points
- Next steps
- Questions?`;
      mimeType = 'text/plain';
    } else {
      content = `File: ${attachment.name}
Type: ${attachment.type}
Size: ${formatFileSize(attachment.size)}

This is a demo file. In a real application, this would be the actual file content.`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert(`Error downloading ${attachment.name}. Please try again.`);
  }
};

export function TodoItem({ todo, currentUser, onComplete }: TodoItemProps) {
  if (!todo || !todo.id) {
    console.warn('TodoItem received invalid todo data:', todo);
    return null;
  }

  const isAssignedToMe = todo.assignedTo === (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'John Smith');
  const overdue = isOverdue(todo.dueDate);
  
  // Check if current user can complete this task
  const canComplete = () => {
    if (!currentUser) return false;
    const currentUserFullName = `${currentUser.firstName} ${currentUser.lastName}`;
    
    // Only the person assigned to the task can complete it (including CEO)
    return todo.assignedTo === currentUserFullName;
  };
  
  // Determine styling based on overdue status and assignment
  const getCardStyling = () => {
    if (overdue) {
      return 'bg-red-50 border-red-200 ring-1 ring-red-200 dark:bg-red-950/20 dark:border-red-800 dark:ring-red-800/50';
    } else if (isAssignedToMe) {
      return 'bg-blue-50 border-blue-200 ring-1 ring-blue-200 dark:bg-blue-950/20 dark:border-blue-800 dark:ring-blue-800/50';
    }
    return '';
  };

  const getTitleStyling = () => {
    if (overdue) {
      return 'text-red-900 dark:text-red-100';
    } else if (isAssignedToMe) {
      return 'text-blue-900 dark:text-blue-100';
    }
    return '';
  };

  const getDescriptionStyling = () => {
    if (overdue) {
      return 'text-red-700 dark:text-red-300';
    } else if (isAssignedToMe) {
      return 'text-blue-700 dark:text-blue-300';
    }
    return 'text-muted-foreground';
  };

  const getMetadataStyling = () => {
    if (overdue) {
      return 'text-red-600 dark:text-red-400';
    } else if (isAssignedToMe) {
      return 'text-blue-600 dark:text-blue-400';
    }
    return 'text-muted-foreground';
  };

  const getBadgeStyling = () => {
    if (overdue) {
      return 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-300';
    } else if (isAssignedToMe) {
      return 'border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300';
    }
    return '';
  };

  const getAvatarStyling = () => {
    if (overdue) {
      return 'ring-2 ring-red-300 dark:ring-red-600';
    } else if (isAssignedToMe) {
      return 'ring-2 ring-blue-300 dark:ring-blue-600';
    }
    return '';
  };

  const getAvatarFallbackStyling = () => {
    if (overdue) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    } else if (isAssignedToMe) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    return '';
  };
  
  return (
    <Card className={`p-4 transition-all ${getCardStyling()}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium ${getTitleStyling()}`}>
              {todo.title}
            </h4>
            <Badge className={priorityColors[todo.priority]}>
              {todo.priority}
            </Badge>
            {overdue && (
              <Badge variant="destructive" className="bg-red-600 text-white dark:bg-red-700 dark:text-red-100">
                Overdue
              </Badge>
            )}
            {isAssignedToMe && !overdue && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Assigned to me
              </Badge>
            )}
            {isAssignedToMe && overdue && (
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Assigned to me
              </Badge>
            )}
          </div>
          
          <p className={`mb-3 ${getDescriptionStyling()}`}>
            {todo.description}
          </p>
          
          {/* Attachments Section */}
          {todo.attachments && todo.attachments.length > 0 && (
            <div className="mb-4">
              <div className={`flex items-center gap-2 text-sm mb-3 ${getMetadataStyling()}`}>
                <Paperclip className="w-4 h-4" />
                <span className="font-semibold">
                  {todo.attachments.length} Attachment{todo.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todo.attachments.map((attachment) => {
                  const fileConfig = getFileIcon(attachment.type);
                  const IconComponent = fileConfig.icon;
                  
                  return (
                    <div 
                      key={attachment.id} 
                      className={`group relative bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 ${
                        overdue 
                          ? 'border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700' 
                          : isAssignedToMe
                            ? 'border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700'
                            : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* File Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          fileConfig.color === 'text-red-600' ? 'bg-red-100 dark:bg-red-900/20' :
                          fileConfig.color === 'text-green-600' ? 'bg-green-100 dark:bg-green-900/20' :
                          fileConfig.color === 'text-blue-600' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          fileConfig.color === 'text-orange-600' ? 'bg-orange-100 dark:bg-orange-900/20' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            fileConfig.color === 'text-red-600' ? 'text-red-600' :
                            fileConfig.color === 'text-green-600' ? 'text-green-600' :
                            fileConfig.color === 'text-blue-600' ? 'text-blue-600' :
                            fileConfig.color === 'text-orange-600' ? 'text-orange-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                            {attachment.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {fileConfig.name} • {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        
                        {/* Download Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            if (attachment.url) {
                              // If we have a URL, open it directly
                              window.open(attachment.url, '_blank');
                            } else {
                              // For files stored in memory, create a download
                              downloadFile(attachment);
                            }
                          }}
                        >
                          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Due Date with relative time */}
          <div className={`flex items-center gap-2 text-sm mb-3 ${getMetadataStyling()}`}>
            <Calendar className={`w-4 h-4 ${overdue ? 'text-red-500' : ''}`} />
            <span className="font-medium">
              Due: {todo.dueDate}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              overdue 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {formatRelativeTime(todo.dueDate)}
            </span>
          </div>
          
          {/* Assignment Information */}
          <div className={`flex items-center gap-4 text-sm ${getMetadataStyling()}`}>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>From {todo.assignedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>To {todo.assignedTo}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {/* Company Badge and Avatar */}
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={getBadgeStyling()}>
              {todo.companyName}
            </Badge>
            <Avatar className={`w-8 h-8 ${getAvatarStyling()}`}>
              <AvatarFallback className={`text-xs ${getAvatarFallbackStyling()}`}>
                {(todo.assignedTo || 'Unknown').split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Complete Button */}
          {canComplete() && onComplete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete(todo.id)}
              className={`text-xs ${
                overdue
                  ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950/20'
                  : isAssignedToMe
                    ? 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-950/20'
                    : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-950/20'
              }`}
            >
              ✓ Complete
            </Button>
          )}
          
          {/* Created Date/Time - Right Bottom */}
          <div className={`flex items-center gap-1 text-xs ${getMetadataStyling()}`}>
            <CalendarClock className="w-3 h-3" />
            <span>
              {formatCreatedDateTime(todo.createdDate, todo.createdTime)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default memo(TodoItem);