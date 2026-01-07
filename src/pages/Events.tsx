import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, DollarSign, Ticket } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  price: number;
  capacity: number;
  image_url: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
  const fetchEvents = async () => {
    // We remove the strict .gte filter temporarily to see if data appears
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Events fetched:", data); // Check your browser console (F12)
      setEvents(data || []);
    }
    setLoading(false);
  };

  fetchEvents();
}, []);

  const handleRegister = async () => {
    if (!selectedEvent) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please login to register for events.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("event_registrations").insert({
        event_id: selectedEvent.id,
        user_id: session.user.id,
        payment_status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "You've been registered for the event. Payment details will be sent to your email.",
      });
      setSelectedEvent(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Upcoming Events</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
              Creator <span className="text-gradient-primary">Events</span> & Meetups
            </h1>
            <p className="text-muted-foreground text-lg">
              Join exclusive events, workshops, and networking sessions designed for creators and brands.
            </p>
          </motion.div>
        </section>

        {/* Events Grid */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 glass-card border-border animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <Card className="p-12 glass-card border-border text-center max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting creator events and workshops.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden glass-card border-border hover:border-primary/30 transition-colors h-full flex flex-col">
                    {/* Event Image */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Ticket className="w-16 h-16 text-primary/40" />
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} className="text-primary" />
                          {new Date(event.event_date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} className="text-primary" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users size={14} className="text-primary" />
                          {event.capacity} seats
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                          <DollarSign size={18} />
                          ₹{event.price.toLocaleString()}
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="gradient-primary hover:opacity-90"
                              onClick={() => setSelectedEvent(event)}
                            >
                              Register
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card border-border">
                            <DialogHeader>
                              <DialogTitle className="font-display text-xl">Event Registration</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="p-4 rounded-lg bg-muted">
                                <h4 className="font-semibold text-foreground mb-2">{selectedEvent?.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{selectedEvent?.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {selectedEvent && new Date(selectedEvent.event_date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {selectedEvent?.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                                <span className="text-foreground font-medium">Registration Fee</span>
                                <span className="text-primary font-bold text-xl">
                                  ₹{selectedEvent?.price.toLocaleString()}
                                </span>
                              </div>
                              <Button 
                                onClick={handleRegister} 
                                className="w-full gradient-primary"
                              >
                                Confirm Registration
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                Payment details will be sent to your registered email.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
