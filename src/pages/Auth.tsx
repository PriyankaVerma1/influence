import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Building2, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "creator";
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();
        
        if (profile) {
          navigate(profile.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });

        navigate(profile?.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              company_name: userType === "brand" ? formData.companyName : null,
              user_type: userType,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            company_name: userType === "brand" ? formData.companyName : null,
            user_type: userType as "brand" | "creator",
          });

          toast({
            title: "Account created!",
            description: "Welcome to Influence Nexus.",
          });

          navigate(userType === "brand" ? "/brand/dashboard" : "/creator/dashboard");
        }
      }
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

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 rounded-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join Influence Nexus"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Sign in to continue to your dashboard"
                : `Create your ${userType === "brand" ? "brand" : "creator"} account`}
            </p>
          </div>

          {/* User Type Tabs (for signup) */}
          {!isLogin && (
            <Tabs
              value={userType}
              onValueChange={(value) => navigate(`/auth?type=${value}`)}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="brand" className="flex items-center gap-2">
                  <Building2 size={16} />
                  Brand
                </TabsTrigger>
                <TabsTrigger value="creator" className="flex items-center gap-2">
                  <User size={16} />
                  Creator
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="bg-muted border-border"
                  />
                </div>

                {userType === "brand" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                      className="bg-muted border-border"
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="bg-muted border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary hover:opacity-90 transition-opacity h-12"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary font-medium">
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
