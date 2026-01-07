import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Plus, 
  LogOut, 
  Megaphone, 
  Users, 
  TrendingUp,
  Calendar,
  DollarSign,
  Sparkles,
  Check,
  X
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline: string;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  company_name: string | null;
}

const BrandDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    deadline: "",
    requirements: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?type=brand");
        return;
      }

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, company_name, user_type")
        .eq("id", session.user.id)
        .single();

      if (profileData?.user_type !== "brand") {
        navigate("/creator/dashboard");
        return;
      }
      setProfile(profileData);

      // 2. Fetch YOUR Campaigns
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("brand_id", session.user.id)
        .order("created_at", { ascending: false });

      setCampaigns(campaignsData || []);

      // 3. Fetch Applications for YOUR campaigns
      const { data: appsData } = await supabase
        .from("campaign_applications")
        .select(`
          id,
          pitch,
          proposed_rate,
          status,
          created_at,
          campaign_id,
          campaigns!inner(title, brand_id),
          profiles:creator_id(full_name)
        `)
        .eq("campaigns.brand_id", session.user.id);

      setApplications(appsData || []);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("campaigns").insert({
        brand_id: session.user.id,
        title: newCampaign.title,
        description: newCampaign.description,
        budget: parseFloat(newCampaign.budget),
        category: newCampaign.category,
        deadline: newCampaign.deadline,
        requirements: newCampaign.requirements,
        status: "active",
      }).select().single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      setNewCampaign({
        title: "",
        description: "",
        budget: "",
        category: "",
        deadline: "",
        requirements: "",
      });
      setIsDialogOpen(false);

      toast({
        title: "Campaign Created!",
        description: "Your campaign is now live.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("campaign_applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));

      toast({
        title: `Application ${newStatus}`,
        description: `The creator has been notified.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = [
    { 
      icon: Megaphone, 
      label: "Active Campaigns", 
      value: campaigns.filter(c => c.status === "active").length 
    },
    { 
      icon: Users, 
      label: "Total Applications", 
      value: applications.length 
    },
    { 
      icon: TrendingUp, 
      label: "Total Budget", 
      value: `₹${campaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toLocaleString()}` 
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold">Brand Dashboard</h1>
              <p className="text-xs text-muted-foreground">{profile?.company_name || "Your Company"}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Welcome, {profile?.full_name || "Brand Partner"}! 👋
          </h2>
          <p className="text-muted-foreground">Manage your campaigns and applications here.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="p-6 glass-card border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">Your Campaigns</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={18} className="mr-2" /> Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-lg">
              <DialogHeader><DialogTitle>Create New Campaign</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateCampaign} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input id="title" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={newCampaign.description} onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input id="budget" type="number" value={newCampaign.budget} onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={newCampaign.category} onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" value={newCampaign.deadline} onChange={(e) => setNewCampaign({ ...newCampaign, deadline: e.target.value })} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full gradient-primary">
                  {loading ? "Creating..." : "Create Campaign"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 glass-card border-border">
              <div className="flex justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">{campaign.status}</span>
                <span className="text-xs text-muted-foreground">{campaign.category}</span>
              </div>
              <h4 className="font-bold text-lg mb-2">{campaign.title}</h4>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{campaign.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-primary font-semibold">₹{campaign.budget.toLocaleString()}</span>
                <span className="text-muted-foreground">{new Date(campaign.deadline).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Applications List */}
        <div className="mt-12">
          <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <Users size={24} className="text-primary" /> Recent Applications
          </h3>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-2"><p className="text-muted-foreground">No applications yet.</p></Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} className="p-6 glass-card border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{app.profiles?.full_name}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{app.campaigns?.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{app.pitch}"</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-bold text-primary">₹{app.proposed_rate?.toLocaleString()}</p>
                    </div>
                    {app.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateApplicationStatus(app.id, 'accepted')} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"><Check size={16} /></Button>
                        <Button size="sm" onClick={() => updateApplicationStatus(app.id, 'rejected')} variant="destructive" className="h-8 w-8 p-0"><X size={16} /></Button>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold uppercase tracking-widest ${app.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandDashboard;