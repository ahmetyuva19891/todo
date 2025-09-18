import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CheckCircle, Calendar, User, CalendarClock, Paperclip, FileText, Image, FileSpreadsheet, Presentation } from "lucide-react";
import { memo } from "react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface CompletedTodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdDate?: string;
  createdTime?: string;
  assignedBy: string;
  assignedTo: string;
  companyName: string;
  attachments?: Attachment[];
  completed: boolean;
  completedAt: string;
  completedBy: string;
}

interface CompletedTodoItemProps {
  todo: CompletedTodoItem;
}

const priorityColors = {
  high: 'bg-muted text-muted-foreground',
  medium: 'bg-muted text-muted-foreground',
  low: 'bg-muted text-muted-foreground'
};

// File type configurations for attachments
const fileTypeConfig = {
  'application/vnd.ms-powerpoint': { icon: Presentation, color: 'text-muted-foreground', name: 'PowerPoint' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: Presentation, color: 'text-muted-foreground', name: 'PowerPoint' },
  'application/msword': { icon: FileText, color: 'text-muted-foreground', name: 'Word' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-muted-foreground', name: 'Word' },
  'application/vnd.ms-excel': { icon: FileSpreadsheet, color: 'text-muted-foreground', name: 'Excel' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, color: 'text-muted-foreground', name: 'Excel' },
  'image/jpeg': { icon: Image, color: 'text-muted-foreground', name: 'JPEG' },
  'image/jpg': { icon: Image, color: 'text-muted-foreground', name: 'JPG' },
  'image/png': { icon: Image, color: 'text-muted-foreground', name: 'PNG' },
  'application/pdf': { icon: FileText, color: 'text-muted-foreground', name: 'PDF' }
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const today = new Date("2025-09-18");
  const targetDate = new Date(dateString + ", 2025");
  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Completed today';
  if (diffDays === 1) return 'Completed yesterday';
  if (diffDays > 1) return `Completed ${diffDays} days ago`;
  return dateString;
};

// Helper function to get file icon and styling
const getFileIcon = (fileType: string) => {
  const config = fileTypeConfig[fileType as keyof typeof fileTypeConfig];
  return config || { icon: FileText, color: 'text-muted-foreground', name: 'File' };
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function CompletedTodoItem({ todo }: CompletedTodoItemProps) {
  if (!todo || !todo.id) {
    console.warn('CompletedTodoItem received invalid todo data:', todo);
    return null;
  }

  return (
    <Card className="p-4 bg-muted/30 border-muted opacity-75 transition-all">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <h4 className="text-muted-foreground line-through">
              {todo.title}
            </h4>
            <Badge className={priorityColors[todo.priority]}>
              {todo.priority}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Completed
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-3 line-through">
            {todo.description}
          </p>
          
          {/* Attachments Section */}
          {todo.attachments && todo.attachments.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm mb-2 text-muted-foreground">
                <Paperclip className="w-4 h-4" />
                <span>
                  {todo.attachments.length} Attachment{todo.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {todo.attachments.map((attachment) => {
                  const fileConfig = getFileIcon(attachment.type);
                  const IconComponent = fileConfig.icon;
                  
                  return (
                    <div 
                      key={attachment.id} 
                      className="flex items-center gap-2 p-2 rounded-md border bg-muted/50 border-muted"
                    >
                      <IconComponent className={`w-4 h-4 flex-shrink-0 ${fileConfig.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fileConfig.name} • {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Completion Information */}
          <div className="flex items-center gap-2 text-sm mb-3 text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium">
              Completed by {todo.completedBy}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {formatRelativeTime(todo.completedAt)}
            </span>
          </div>
          
          {/* Original Due Date */}
          <div className="flex items-center gap-2 text-sm mb-3 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Original due: {todo.dueDate}
            </span>
          </div>
          
          {/* Assignment Information */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>From {todo.assignedBy} to {todo.assignedTo}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {/* Company Badge and Avatar */}
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="border-muted text-muted-foreground">
              {todo.companyName}
            </Badge>
            <Avatar className="w-8 h-8 opacity-60">
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {todo.assignedTo.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default memo(CompletedTodoItem);