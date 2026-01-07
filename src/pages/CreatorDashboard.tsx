import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Briefcase, 
  CheckCircle, 
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Sparkles,
  Send
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline: string;
  requirements: string | null;
  status: string;
  brand_id: string;
  profiles?: {
    company_name: string | null;
  };
}

interface Application {
  id: string;
  campaign_id: string;
  status: string;
  campaigns?: Campaign;
}

interface Profile {
  full_name: string | null;
  niche: string | null;
  follower_count: number | null;
}

const CreatorDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [applicationData, setApplicationData] = useState({
    pitch: "",
    proposedRate: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?type=creator");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, niche, follower_count, user_type")
        .eq("id", session.user.id)
        .single();

      if (profileData?.user_type !== "creator") {
        navigate("/brand/dashboard");
        return;
      }

      setProfile(profileData);

      // Fetch active campaigns
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*, profiles:brand_id(company_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      setCampaigns(campaignsData || []);

      // Fetch creator's applications
      const { data: applicationsData } = await supabase
        .from("campaign_applications")
        .select("*, campaigns(*)")
        .eq("creator_id", session.user.id);

      setApplications(applicationsData || []);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("campaign_applications").insert({
        campaign_id: selectedCampaign.id,
        creator_id: session.user.id,
        pitch: applicationData.pitch,
        proposed_rate: applicationData.proposedRate ? parseFloat(applicationData.proposedRate) : null,
        status: "pending",
      }).select().single();

      if (error) throw error;

      setApplications([...applications, { ...data, campaigns: selectedCampaign }]);
      setSelectedCampaign(null);
      setApplicationData({ pitch: "", proposedRate: "" });

      toast({
        title: "Application Submitted!",
        description: "The brand will review your application soon.",
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const hasApplied = (campaignId: string) => 
    applications.some(app => app.campaign_id === campaignId);

  const stats = [
    { icon: Briefcase, label: "Applications", value: applications.length },
    { icon: CheckCircle, label: "Accepted", value: applications.filter(a => a.status === "accepted").length },
    { icon: Clock, label: "Pending", value: applications.filter(a => a.status === "pending").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground">Creator Dashboard</h1>
              <p className="text-xs text-muted-foreground">{profile?.full_name || "Creator"}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Welcome, {profile?.full_name || "Creator"}! 🎨
          </h2>
          <p className="text-muted-foreground">
            Discover brand campaigns and grow your influence.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 glass-card border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Available Campaigns */}
        <div className="mb-8">
          <h3 className="text-xl font-display font-bold text-foreground mb-6">Available Campaigns</h3>
          
          {campaigns.length === 0 ? (
            <Card className="p-12 glass-card border-border text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-display font-semibold text-foreground mb-2">No Campaigns Available</h4>
              <p className="text-muted-foreground">Check back later for new opportunities.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 glass-card border-border hover:border-secondary/30 transition-colors h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                        {campaign.category}
                      </span>
                      {hasApplied(campaign.id) && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          Applied
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-semibold text-foreground text-lg mb-2">
                      {campaign.title}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Building2 size={14} />
                      {campaign.profiles?.company_name || "Brand"}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                      {campaign.description}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-1 text-primary">
                        <DollarSign size={14} />
                        ₹{campaign.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full gradient-secondary hover:opacity-90"
                          disabled={hasApplied(campaign.id)}
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          {hasApplied(campaign.id) ? "Already Applied" : "Apply Now"}
                          {!hasApplied(campaign.id) && <Send size={16} className="ml-2" />}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-border max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-display text-xl">Apply to Campaign</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4 p-4 rounded-lg bg-muted">
                          <h4 className="font-semibold text-foreground mb-1">{selectedCampaign?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Budget: ₹{selectedCampaign?.budget.toLocaleString()}
                          </p>
                        </div>
                        <form onSubmit={handleApply} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pitch">Your Pitch</Label>
                            <Textarea
                              id="pitch"
                              placeholder="Tell the brand why you're perfect for this campaign..."
                              value={applicationData.pitch}
                              onChange={(e) => setApplicationData({ ...applicationData, pitch: e.target.value })}
                              required
                              className="bg-muted border-border min-h-[120px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="proposedRate">Your Rate (₹) - Optional</Label>
                            <Input
                              id="proposedRate"
                              type="number"
                              placeholder="Your proposed rate"
                              value={applicationData.proposedRate}
                              onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                              className="bg-muted border-border"
                            />
                          </div>
                          <Button type="submit" disabled={loading} className="w-full gradient-secondary">
                            {loading ? "Submitting..." : "Submit Application"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications */}
        {applications.length > 0 && (
          <div>
            <h3 className="text-xl font-display font-bold text-foreground mb-6">My Applications</h3>
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="p-4 glass-card border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{app.campaigns?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Applied on {new Date(app.campaigns?.deadline || "").toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "accepted" 
                        ? "bg-accent/20 text-accent" 
                        : app.status === "rejected"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatorDashboard;
