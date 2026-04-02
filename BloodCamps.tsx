import { useState } from "react";
import { Link } from "react-router-dom";
import { Tent, MapPin, Calendar, Clock, Users, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { states } from "@/data/mockData";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const BloodCamps = () => {
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["blood-camps", stateFilter, statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (stateFilter && stateFilter !== 'all') params.state = stateFilter;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

      const { data } = await api.get("/blood-camps", { params });
      return data;
    },
  });


  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Blood Donation Camps</h1>
          <p className="text-primary-foreground/80">Find upcoming blood donation camps near you and register to participate</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="bg-card rounded-xl shadow-card p-4 md:p-6 -mt-16 relative z-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setStateFilter(""); setStatusFilter(""); }}>Clear Filters</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading camps...</div>
        ) : camps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No camps found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camps.map((camp: any) => (
              <div key={camp._id} className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                <div className="gradient-primary p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary-foreground">
                    <Tent className="h-5 w-5" />
                    <h3 className="font-heading font-semibold text-lg">{camp.name}</h3>
                  </div>
                  <Badge className={camp.status === "upcoming" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}>
                    {camp.status === "upcoming" ? "Upcoming" : "Completed"}
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground">{camp.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(camp.camp_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{camp.start_time} - {camp.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{camp.district}, {camp.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Max {camp.max_donors} donors</span>
                    </div>
                    {camp.contact_phone && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{camp.contact_phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Organized by: <strong>{camp.organizer}</strong></span>
                    {camp.status === "upcoming" && (
                      <Link to={`/camp-register/${camp._id}`}>
                        <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90 gap-1">
                          Register <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BloodCamps;
