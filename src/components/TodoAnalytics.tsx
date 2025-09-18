import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Building } from "lucide-react";
import { memo } from "react";

interface TodoItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdDate?: string;
  assignedBy: string;
  assignedTo: string;
  companyName: string;
  completed?: boolean;
  completedAt?: string;
  completedBy?: string;
}

interface TodoAnalyticsProps {
  todos: TodoItem[];
  completedTodos: TodoItem[];
  companies: Array<{ id: string; name: string; }>;
}

export function TodoAnalytics({ todos, completedTodos, companies }: TodoAnalyticsProps) {
  // Helper function to check if a todo is overdue
  const isOverdue = (dueDate: string): boolean => {
    const today = new Date("2025-09-18");
    const due = new Date(dueDate + ", 2025");
    return due < today;
  };

  // Calculate completion days
  const getCompletionDays = (createdDate: string, completedAt: string): number => {
    const created = new Date(createdDate + ", 2025");
    const completed = new Date(completedAt + ", 2025");
    const diffTime = completed.getTime() - created.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Overall Statistics
  const totalTodos = todos.length + completedTodos.length;
  const completionRate = totalTodos > 0 ? (completedTodos.length / totalTodos) * 100 : 0;
  const overdueTodos = todos.filter(todo => isOverdue(todo.dueDate));
  const highPriorityPending = todos.filter(todo => todo.priority === 'high').length;

  // Average completion time
  const completionTimes = completedTodos
    .filter(todo => todo.createdDate && todo.completedAt)
    .map(todo => getCompletionDays(todo.createdDate!, todo.completedAt!));
  const avgCompletionTime = completionTimes.length > 0 
    ? Math.round(completionTimes.reduce((sum, days) => sum + days, 0) / completionTimes.length)
    : 0;

  // Company-wise statistics
  const companyStats = companies.map(company => {
    const companyTodos = todos.filter(todo => todo.companyName === company.name);
    const companyCompleted = completedTodos.filter(todo => todo.companyName === company.name);
    const companyTotal = companyTodos.length + companyCompleted.length;
    const companyRate = companyTotal > 0 ? (companyCompleted.length / companyTotal) * 100 : 0;
    const companyOverdue = companyTodos.filter(todo => isOverdue(todo.dueDate)).length;
    
    return {
      name: company.name,
      pending: companyTodos.length,
      completed: companyCompleted.length,
      total: companyTotal,
      completionRate: companyRate,
      overdue: companyOverdue
    };
  });

  // Priority breakdown
  const priorityStats = {
    high: {
      pending: todos.filter(todo => todo.priority === 'high').length,
      completed: completedTodos.filter(todo => todo.priority === 'high').length
    },
    medium: {
      pending: todos.filter(todo => todo.priority === 'medium').length,
      completed: completedTodos.filter(todo => todo.priority === 'medium').length
    },
    low: {
      pending: todos.filter(todo => todo.priority === 'low').length,
      completed: completedTodos.filter(todo => todo.priority === 'low').length
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedTodos.length} of {totalTodos} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Average Completion Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgCompletionTime} days</div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {completionTimes.length} completed tasks
          </p>
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{overdueTodos.length}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {overdueTodos.length > 0 ? 'Require immediate attention' : 'All tasks on track'}
          </p>
        </CardContent>
      </Card>

      {/* High Priority Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <CheckCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{highPriorityPending}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Pending high priority tasks
          </p>
        </CardContent>
      </Card>

      {/* Company Performance */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Company Performance
          </CardTitle>
          <CardDescription>Task completion by company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyStats.map((company) => (
              <div key={company.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{company.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {company.completionRate.toFixed(0)}%
                    </Badge>
                    {company.overdue > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {company.overdue} overdue
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={company.completionRate} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{company.completed} completed</span>
                  <span>{company.pending} pending</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Priority Breakdown
          </CardTitle>
          <CardDescription>Task distribution by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(priorityStats).map(([priority, stats]) => {
              const total = stats.pending + stats.completed;
              const rate = total > 0 ? (stats.completed / total) * 100 : 0;
              const priorityColor = priority === 'high' ? 'text-destructive' : 
                                  priority === 'medium' ? 'text-orange-600' : 'text-green-600';
              
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium capitalize ${priorityColor}`}>
                      {priority} Priority
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {rate.toFixed(0)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({stats.completed}/{total})
                      </span>
                    </div>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(TodoAnalytics);