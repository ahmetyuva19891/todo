import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, Upload, X, Plus, Save, Users, Trash2, Edit2, Image, Video, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CompanyProfileEditorProps {
  companyId: string;
  onBack: () => void;
  onSave: (companyData: any) => void;
}

// Mock company data structure for editing
const initialCompanyData = {
  "1": {
    id: "1",
    name: "TechVision Inc",
    logo: "https://images.unsplash.com/photo-1746046936818-8d432ebd3d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwY29tcGFueSUyMGxvZ288ZW58MXx8fHwxNzU3ODYzNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
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
        url: "https://example.com/video1"
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

export function CompanyProfileEditor({ companyId, onBack, onSave }: CompanyProfileEditorProps) {
  const [companyData, setCompanyData] = useState(initialCompanyData[companyId as keyof typeof initialCompanyData]);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingLeader, setIsAddingLeader] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideo, setNewVideo] = useState({ title: "", url: "", thumbnail: "" });
  const [newLeader, setNewLeader] = useState({ name: "", role: "", initials: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the company data to prevent unnecessary re-renders
  const memoizedCompanyData = useMemo(() => companyData, [companyData]);

  if (!companyData) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1>Company Not Found</h1>
        <p className="text-muted-foreground">The requested company could not be found.</p>
      </div>
    );
  }

  const handleSave = useCallback(() => {
    onSave(companyData);
    onBack();
  }, [companyData, onSave, onBack]);

  const addImageToGallery = useCallback((imageUrl: string) => {
    if (!imageUrl.trim()) return;
    setCompanyData(prev => ({
      ...prev,
      gallery: [...prev.gallery, imageUrl]
    }));
    setNewImageUrl("");
    setIsAddingImage(false);
  }, []);

  const removeImageFromGallery = useCallback((index: number) => {
    setCompanyData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  }, []);

  const addVideo = useCallback(() => {
    if (newVideo.title && newVideo.url) {
      setCompanyData(prev => ({
        ...prev,
        videos: [...prev.videos, { ...newVideo, duration: "0:00" }]
      }));
      setNewVideo({ title: "", url: "", thumbnail: "" });
      setIsAddingVideo(false);
    }
  }, [newVideo]);

  const removeVideo = useCallback((index: number) => {
    setCompanyData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  }, []);

  const addLeader = useCallback(() => {
    if (newLeader.name && newLeader.role) {
      const initials = newLeader.initials || newLeader.name.split(' ').map(n => n[0]).join('').toUpperCase();
      setCompanyData(prev => ({
        ...prev,
        leadership: [...prev.leadership, { ...newLeader, initials }]
      }));
      setNewLeader({ name: "", role: "", initials: "" });
      setIsAddingLeader(false);
    }
  }, [newLeader]);

  const removeLeader = useCallback((index: number) => {
    setCompanyData(prev => ({
      ...prev,
      leadership: prev.leadership.filter((_, i) => i !== index)
    }));
  }, []);

  const updateMetric = useCallback((index: number, field: string, value: string) => {
    setCompanyData(prev => {
      const updatedMetrics = [...prev.keyMetrics];
      updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
      return { ...prev, keyMetrics: updatedMetrics };
    });
  }, []);

  const addMetric = useCallback(() => {
    setCompanyData(prev => ({
      ...prev,
      keyMetrics: [...prev.keyMetrics, { label: "New Metric", value: "0", trend: "+0%" }]
    }));
  }, []);

  const removeMetric = useCallback((index: number) => {
    setCompanyData(prev => ({
      ...prev,
      keyMetrics: prev.keyMetrics.filter((_, i) => i !== index)
    }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Company Profile
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold">Edit Company Profile</h1>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Images & Videos</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Logo & Hero */}
            <Card>
              <CardHeader>
                <CardTitle>Company Branding</CardTitle>
                <CardDescription>Manage your company logo and hero image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo">Company Logo URL</Label>
                  <Input
                    id="logo"
                    value={companyData.logo}
                    onChange={(e) => setCompanyData({ ...companyData, logo: e.target.value })}
                    placeholder="Enter logo image URL"
                  />
                  {companyData.logo && (
                    <div className="mt-2">
                      <ImageWithFallback
                        src={companyData.logo}
                        alt="Company logo preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="hero">Hero Image URL</Label>
                  <Input
                    id="hero"
                    value={companyData.heroImage}
                    onChange={(e) => setCompanyData({ ...companyData, heroImage: e.target.value })}
                    placeholder="Enter hero image URL"
                  />
                  {companyData.heroImage && (
                    <div className="mt-2">
                      <ImageWithFallback
                        src={companyData.heroImage}
                        alt="Hero image preview"
                        className="w-full h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic company details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="founded">Founded</Label>
                    <Input
                      id="founded"
                      value={companyData.founded}
                      onChange={(e) => setCompanyData({ ...companyData, founded: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employees">Employees</Label>
                    <Input
                      id="employees"
                      value={companyData.employees}
                      onChange={(e) => setCompanyData({ ...companyData, employees: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="revenue">Revenue</Label>
                    <Input
                      id="revenue"
                      value={companyData.revenue}
                      onChange={(e) => setCompanyData({ ...companyData, revenue: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={companyData.location}
                    onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Company contact details and social links</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={companyData.linkedin}
                    onChange={(e) => setCompanyData({ ...companyData, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Media Management Tab */}
        <TabsContent value="media" className="space-y-6">
          {/* Quick Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload images and videos for your company profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Images Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Images</Label>
                    <p className="text-sm text-muted-foreground mt-1">Add images to your company gallery</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Image URL Input */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter image URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (newImageUrl.trim()) {
                              addImageToGallery(newImageUrl);
                              setNewImageUrl('');
                            }
                          }}
                          disabled={!newImageUrl.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    {/* File Upload Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files) {
                            Array.from(target.files).forEach(file => {
                              const fileUrl = URL.createObjectURL(file);
                              addImageToGallery(fileUrl);
                            });
                          }
                        };
                        input.click();
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Image className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload Image Files</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Videos Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Videos</Label>
                    <p className="text-sm text-muted-foreground mt-1">Add videos to your company profile</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Video Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Video Title</Label>
                      <Input
                        placeholder="Enter video title"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      />
                    </div>
                    
                    {/* Video URL Input */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Video URL</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter video URL"
                          value={newVideo.url}
                          onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (newVideo.url.trim() && newVideo.title.trim()) {
                              addVideo();
                            }
                          }}
                          disabled={!newVideo.url.trim() || !newVideo.title.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    {/* File Upload Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'video/*';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files) {
                            Array.from(target.files).forEach(file => {
                              const fileUrl = URL.createObjectURL(file);
                              setNewVideo({ 
                                ...newVideo, 
                                url: fileUrl,
                                title: newVideo.title || file.name
                              });
                              addVideo();
                            });
                          }
                        };
                        input.click();
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Video className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload Video Files</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Photo Gallery
                  </span>
                  <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Image</DialogTitle>
                        <DialogDescription>
                          Add a new image to your company gallery
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Image URL Input */}
                        <div>
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                          />
                        </div>
                        
                        {/* File Upload Button */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Or upload image files:</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files && target.files[0]) {
                                  // Convert file to URL for preview
                                  const fileUrl = URL.createObjectURL(target.files[0]);
                                  setNewImageUrl(fileUrl);
                                }
                              };
                              input.click();
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Image className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Upload Image Files</span>
                            </div>
                          </Button>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Or search for stock images:</p>
                          <div className="flex gap-2">
                            <Input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search for images (e.g. 'office building')"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={async () => {
                                if (searchQuery.trim()) {
                                  // This would use the unsplash_tool in a real implementation
                                  // For now, we'll use a placeholder
                                  const placeholderUrl = `https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU4MDk4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080`;
                                  setNewImageUrl(placeholderUrl);
                                }
                              }}
                            >
                              Search
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddingImage(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => addImageToGallery(newImageUrl)}>
                            Add Image
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {companyData.gallery.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImageFromGallery(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Company Videos
                  </span>
                  <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Video
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Video</DialogTitle>
                        <DialogDescription>
                          Add a new video to your company profile
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="videoTitle">Video Title</Label>
                          <Input
                            id="videoTitle"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            placeholder="Enter video title"
                          />
                        </div>
                        
                        {/* Video URL Input */}
                        <div>
                          <Label htmlFor="videoUrl">Video URL</Label>
                          <Input
                            id="videoUrl"
                            value={newVideo.url}
                            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                            placeholder="Enter video URL"
                          />
                        </div>
                        
                        {/* Video File Upload Button */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Or upload video files:</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = 'video/*';
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files && target.files[0]) {
                                  // Convert file to URL for preview
                                  const fileUrl = URL.createObjectURL(target.files[0]);
                                  setNewVideo({ 
                                    ...newVideo, 
                                    url: fileUrl,
                                    title: newVideo.title || target.files[0].name
                                  });
                                }
                              };
                              input.click();
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Video className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Upload Video Files</span>
                            </div>
                          </Button>
                        </div>
                        
                        <div>
                          <Label htmlFor="videoThumbnail">Thumbnail URL</Label>
                          <Input
                            id="videoThumbnail"
                            value={newVideo.thumbnail}
                            onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                            placeholder="Enter thumbnail URL"
                          />
                        </div>
                        
                        {/* Thumbnail Upload Button */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Or upload thumbnail image:</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files && target.files[0]) {
                                  // Convert file to URL for preview
                                  const fileUrl = URL.createObjectURL(target.files[0]);
                                  setNewVideo({ ...newVideo, thumbnail: fileUrl });
                                }
                              };
                              input.click();
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Image className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Upload Thumbnail Image</span>
                            </div>
                          </Button>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddingVideo(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addVideo}>
                            Add Video
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companyData.videos.map((video, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{video.duration}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Key Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Key Performance Metrics
                <Button onClick={addMetric}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.keyMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Metric {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMetric(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={metric.label}
                          onChange={(e) => updateMetric(index, 'label', e.target.value)}
                          placeholder="Metric label"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Value</Label>
                          <Input
                            value={metric.value}
                            onChange={(e) => updateMetric(index, 'value', e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                        <div>
                          <Label>Trend</Label>
                          <Input
                            value={metric.trend}
                            onChange={(e) => updateMetric(index, 'trend', e.target.value)}
                            placeholder="Trend"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leadership Tab */}
        <TabsContent value="leadership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Leadership Team
                </span>
                <Dialog open={isAddingLeader} onOpenChange={setIsAddingLeader}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Leader
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Leader</DialogTitle>
                      <DialogDescription>
                        Add a new leader to your team
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="leaderName">Full Name</Label>
                        <Input
                          id="leaderName"
                          value={newLeader.name}
                          onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="leaderRole">Role</Label>
                        <Input
                          id="leaderRole"
                          value={newLeader.role}
                          onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                          placeholder="Enter role/position"
                        />
                      </div>
                      <div>
                        <Label htmlFor="leaderInitials">Initials (optional)</Label>
                        <Input
                          id="leaderInitials"
                          value={newLeader.initials}
                          onChange={(e) => setNewLeader({ ...newLeader, initials: e.target.value })}
                          placeholder="Leave empty to auto-generate"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingLeader(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addLeader}>
                          Add Leader
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.leadership.map((leader, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                    <Avatar>
                      <AvatarFallback>{leader.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{leader.name}</p>
                      <p className="text-sm text-muted-foreground">{leader.role}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLeader(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Tab */}
        <TabsContent value="investment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Manage investment and ownership information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentDate">Investment Date</Label>
                  <Input
                    id="investmentDate"
                    value={companyData.investmentDate}
                    onChange={(e) => setCompanyData({ ...companyData, investmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ownership">Ownership Percentage</Label>
                  <Input
                    id="ownership"
                    value={companyData.ownershipPercentage}
                    onChange={(e) => setCompanyData({ ...companyData, ownershipPercentage: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={companyData.status}
                  onChange={(e) => setCompanyData({ ...companyData, status: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}