import { ArrowLeft, ExternalLink, MapPin, Users, Calendar, DollarSign, Briefcase, Phone, Mail, Globe, CheckSquare, Edit, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { TodoItem } from "./TodoItem";
import { Dialog, DialogContent } from "./ui/dialog";

interface CompanyDetailProps {
  companyId: string;
  onBack: () => void;
  onEdit?: (companyId: string) => void;
}

// Extended mock data for company details
const companyDetails = {
  "1": {
    id: "1",
    name: "TechVision Inc",
    logo: "https://images.unsplash.com/photo-1746046936818-8d432ebd3d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwY29tcGFueSUyMGxvZ298ZW58MXx8fHwxNzU3ODYzNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Leading technology solutions provider specializing in AI-driven enterprise software and cloud infrastructure.",
    industry: "Technology",
    founded: "2019",
    employees: "250-500",
    revenue: "$50M - $100M",
    location: "San Francisco, CA",
    website: "https://techvision.com",
    linkedin: "https://linkedin.com/company/techvision-inc",
    phone: "+1 (555) 123-4567",
    email: "contact@techvision.com",
    status: "Active",
    investmentDate: "January 2021",
    ownershipPercentage: "25%",
    heroImage: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    videos: [
      {
        title: "Company Overview 2024",
        thumbnail: "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        duration: "3:45",
        url: "#"
      },
      {
        title: "Product Demo - AI Platform",
        thumbnail: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        duration: "8:20",
        url: "#"
      }
    ],
    keyMetrics: [
      { label: "Annual Revenue", value: "$75M", trend: "+15%" },
      { label: "Customer Count", value: "1,200+", trend: "+8%" },
      { label: "Market Share", value: "12%", trend: "+2%" },
      { label: "Employee Satisfaction", value: "4.6/5", trend: "+0.3" }
    ],
    leadership: [
      { name: "Sarah Chen", role: "CEO & Founder", initials: "SC" },
      { name: "Michael Rodriguez", role: "CTO", initials: "MR" },
      { name: "Jennifer Kim", role: "VP Sales", initials: "JK" },
      { name: "David Park", role: "VP Engineering", initials: "DP" }
    ]
  },
  "2": {
    id: "2",
    name: "Global Finance Corp",
    logo: "https://images.unsplash.com/photo-1684128169771-f4ff82dffbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwY29ycG9yYXRlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU3OTUzODk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premier financial services firm providing investment management, wealth advisory, and corporate finance solutions.",
    industry: "Financial Services",
    founded: "2015",
    employees: "500-1000",
    revenue: "$100M - $250M",
    location: "New York, NY",
    website: "https://globalfinancecorp.com",
    linkedin: "https://linkedin.com/company/global-finance-corp",
    phone: "+1 (555) 234-5678",
    email: "info@globalfinancecorp.com",
    status: "Active",
    investmentDate: "March 2020",
    ownershipPercentage: "40%",
    heroImage: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    videos: [
      {
        title: "Financial Market Insights 2024",
        thumbnail: "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        duration: "12:30",
        url: "#"
      }
    ],
    keyMetrics: [
      { label: "Assets Under Management", value: "$2.5B", trend: "+12%" },
      { label: "Client Accounts", value: "5,000+", trend: "+18%" },
      { label: "ROI Average", value: "14.2%", trend: "+1.8%" },
      { label: "Client Retention", value: "94%", trend: "+2%" }
    ],
    leadership: [
      { name: "Robert Thompson", role: "CEO", initials: "RT" },
      { name: "Lisa Martinez", role: "CFO", initials: "LM" },
      { name: "James Wilson", role: "VP Investments", initials: "JW" }
    ]
  },
  "3": {
    id: "3",
    name: "Retail Solutions Ltd",
    logo: "https://images.unsplash.com/photo-1590764095558-abd89de9db5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHNob3BwaW5nfGVufDF8fHx8MTc1Nzk1Mzg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Innovative retail technology platform helping brands optimize their omnichannel customer experience.",
    industry: "Retail Technology",
    founded: "2018",
    employees: "100-250",
    revenue: "$25M - $50M",
    location: "Austin, TX",
    website: "https://retailsolutions.com",
    linkedin: "https://linkedin.com/company/retail-solutions-ltd",
    phone: "+1 (555) 345-6789",
    email: "hello@retailsolutions.com",
    status: "Active",
    investmentDate: "July 2022",
    ownershipPercentage: "30%",
    heroImage: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    videos: [
      {
        title: "Retail Revolution: Our Vision",
        thumbnail: "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        duration: "5:15",
        url: "#"
      }
    ],
    keyMetrics: [
      { label: "Monthly Active Users", value: "2.1M", trend: "+25%" },
      { label: "Partner Retailers", value: "450", trend: "+35%" },
      { label: "Transaction Volume", value: "$120M", trend: "+28%" },
      { label: "Platform Uptime", value: "99.9%", trend: "0%" }
    ],
    leadership: [
      { name: "Amanda Rodriguez", role: "CEO", initials: "AR" },
      { name: "Kevin Lee", role: "CTO", initials: "KL" },
      { name: "Sofia Chen", role: "VP Product", initials: "SC" }
    ]
  },
  "4": {
    id: "4",
    name: "Manufacturing Pro",
    logo: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW51ZmFjdHVyaW5nJTIwZmFjdG9yeXxlbnwxfHx8fDE3NTc5NTM5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Advanced manufacturing solutions provider specializing in automation, quality control, and supply chain optimization.",
    industry: "Manufacturing",
    founded: "2016",
    employees: "300-500",
    revenue: "$75M - $150M",
    location: "Detroit, MI",
    website: "https://manufacturingpro.com",
    linkedin: "https://linkedin.com/company/manufacturing-pro",
    phone: "+1 (555) 456-7890",
    email: "contact@manufacturingpro.com",
    status: "Active",
    investmentDate: "September 2021",
    ownershipPercentage: "35%",
    heroImage: "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTgwOTgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    videos: [
      {
        title: "Smart Factory Tour",
        thumbnail: "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc1ODE1NTIyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        duration: "6:40",
        url: "#"
      }
    ],
    keyMetrics: [
      { label: "Production Efficiency", value: "94%", trend: "+8%" },
      { label: "Quality Score", value: "98.5%", trend: "+2%" },
      { label: "Cost Reduction", value: "22%", trend: "+5%" },
      { label: "Safety Record", value: "Zero incidents", trend: "0" }
    ],
    leadership: [
      { name: "David Martinez", role: "CEO", initials: "DM" },
      { name: "Elena Petrov", role: "COO", initials: "EP" },
      { name: "Carlos Rodriguez", role: "VP Engineering", initials: "CR" }
    ]
  }
};

// Todo items data (shared with Dashboard)
const todos = [
  {
    id: "1",
    title: "Complete Q4 Financial Report",
    description: "Prepare comprehensive financial analysis and projections for the fourth quarter",
    priority: "high" as const,
    dueDate: "Sept 20, 2025",
    assignedBy: "Sarah Johnson",
    assignedTo: "Michael Roberts",
    companyName: "Global Finance Corp"
  },
  {
    id: "2",
    title: "Update Security Protocols",
    description: "Review and implement new cybersecurity measures across all systems",
    priority: "high" as const,
    dueDate: "Sept 16, 2025", // Overdue
    assignedBy: "Mike Chen",
    assignedTo: "Alex Thompson",
    companyName: "TechVision Inc"
  },
  {
    id: "3",
    title: "Inventory Management Review",
    description: "Analyze current inventory levels and optimize stock management",
    priority: "medium" as const,
    dueDate: "Sept 25, 2025",
    assignedBy: "Lisa Rodriguez",
    assignedTo: "Jennifer Kim",
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "4",
    title: "Equipment Maintenance Schedule",
    description: "Plan and schedule routine maintenance for manufacturing equipment",
    priority: "medium" as const,
    dueDate: "Sept 15, 2025", // Overdue
    assignedBy: "David Park",
    assignedTo: "Robert Martinez",
    companyName: "Manufacturing Pro"
  },
  {
    id: "5",
    title: "Team Training Session",
    description: "Organize training for new project management software",
    priority: "low" as const,
    dueDate: "Sept 30, 2025",
    assignedBy: "Emily Davis",
    assignedTo: "Amanda Lee",
    companyName: "TechVision Inc"
  },
  {
    id: "6",
    title: "Customer Feedback Analysis",
    description: "Review customer satisfaction surveys and identify improvement areas",
    priority: "medium" as const,
    dueDate: "Sept 28, 2025",
    assignedBy: "Tom Wilson",
    assignedTo: "Carlos Anderson",
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "7",
    title: "Strategic Partnership Review",
    description: "Evaluate current partnerships and identify new opportunities for collaboration",
    priority: "high" as const,
    dueDate: "Sept 19, 2025",
    assignedBy: "Sarah Johnson",
    assignedTo: "John Smith",
    companyName: "Global Finance Corp"
  },
  {
    id: "8",
    title: "AI Platform Integration Testing",
    description: "Conduct comprehensive testing of new AI platform integration with existing systems",
    priority: "medium" as const,
    dueDate: "Sept 17, 2025", // Overdue and assigned to me
    assignedBy: "Michael Rodriguez",
    assignedTo: "John Smith",
    companyName: "TechVision Inc"
  },
  {
    id: "9",
    title: "Board Meeting Preparation",
    description: "Prepare quarterly board meeting materials and financial presentations",
    priority: "high" as const,
    dueDate: "Sept 21, 2025",
    assignedBy: "Robert Thompson",
    assignedTo: "John Smith",
    companyName: "Global Finance Corp"
  },
  {
    id: "10",
    title: "Market Research Analysis",
    description: "Analyze competitor strategies and market trends for retail technology sector",
    priority: "medium" as const,
    dueDate: "Sept 27, 2025",
    assignedBy: "Amanda Rodriguez",
    assignedTo: "John Smith",
    companyName: "Retail Solutions Ltd"
  },
  {
    id: "11",
    title: "Production Efficiency Optimization",
    description: "Implement new process improvements to increase manufacturing efficiency",
    priority: "low" as const,
    dueDate: "Oct 5, 2025",
    assignedBy: "David Martinez",
    assignedTo: "John Smith",
    companyName: "Manufacturing Pro"
  },
  {
    id: "12",
    title: "Investment Portfolio Review",
    description: "Review and rebalance investment portfolio based on Q3 performance metrics",
    priority: "high" as const,
    dueDate: "Sept 14, 2025", // Overdue and assigned to me
    assignedBy: "Lisa Martinez",
    assignedTo: "John Smith",
    companyName: "Global Finance Corp"
  }
];

export function CompanyDetail({ companyId, onBack, onEdit }: CompanyDetailProps) {
  const company = companyDetails[companyId as keyof typeof companyDetails];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; url: string; thumbnail: string } | null>(null);
  
  // Memoize filtered todos to prevent recalculation on every render
  const companyTodos = useMemo(() => {
    if (!company) return [];
    return todos.filter(todo => todo.companyName === company.name);
  }, [company]);

  if (!company) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1>Company Not Found</h1>
        <p className="text-muted-foreground">The requested company could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          {onEdit && (
            <Button onClick={() => onEdit(companyId)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Website
            </a>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <ImageWithFallback
              src={company.heroImage}
              alt={`${company.name} office`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 backdrop-blur">
                    <ImageWithFallback
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-white mb-1">{company.name}</h1>
                    <Badge variant="secondary">{company.status}</Badge>
                  </div>
                </div>
                <p className="text-gray-200 max-w-2xl">{company.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p>{company.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p>{company.founded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p>{company.employees}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p>{company.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{company.location}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4>Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                      {company.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {company.keyMetrics.map((metric, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold">{metric.value}</span>
                      <Badge variant={metric.trend.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leadership Team */}
          <Card>
            <CardHeader>
              <CardTitle>Leadership Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {company.leadership.map((leader, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{leader.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{leader.name}</p>
                      <p className="text-sm text-muted-foreground">{leader.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Details & Media */}
        <div className="space-y-6">
          {/* Investment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Investment Date</p>
                <p>{company.investmentDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ownership</p>
                <p className="text-xl font-semibold text-primary">{company.ownershipPercentage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {company.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${company.name} photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Company Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {company.videos.map((video, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer hover:bg-muted/50 transition-colors p-2 rounded-lg"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <ImageWithFallback
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-primary border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary">{video.duration}</Badge>
                      </div>
                    </div>
                    <p className="font-medium group-hover:text-primary transition-colors">{video.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Active Todo Items ({companyTodos.length})
            </CardTitle>
            <CardDescription>
              Current tasks and projects assigned to {company.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {companyTodos.length > 0 ? (
              <div className="space-y-3">
                {companyTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active todo items for this company</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            {selectedImage && (
              <ImageWithFallback
                src={selectedImage}
                alt="Full size image"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            {selectedVideo && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50">
                  <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                </div>
                <div className="aspect-video">
                  <video
                    src={selectedVideo.url}
                    controls
                    className="w-full h-full object-contain"
                    poster={selectedVideo.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}