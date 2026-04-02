import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Award, Droplets, Download, ArrowLeft, Calendar, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const Certificate = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const certRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["certificate", registrationId],
    queryFn: async () => {
      const { data } = await api.get(`/camp-registrations/${registrationId}`);
      return data;
    },
    enabled: !!registrationId,
  });


  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading certificate...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-2">Certificate Not Found</h2>
          <p className="text-muted-foreground mb-4">This certificate does not exist or you don't have access.</p>
          <Link to="/blood-camps"><Button variant="outline">Back to Camps</Button></Link>
        </div>
      </div>
    );
  }

  const camp = data.camp;

  const donatedDate = data.donated_at
    ? new Date(data.donated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/blood-camps" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Camps
        </Link>
        <Button onClick={handlePrint} className="gradient-primary text-primary-foreground hover:opacity-90 gap-2">
          <Download className="h-4 w-4" /> Print / Download
        </Button>
      </div>

      <div ref={certRef} className="max-w-3xl mx-auto bg-card rounded-xl shadow-card overflow-hidden print:shadow-none">
        {/* Certificate Border Design */}
        <div className="border-[6px] border-double border-primary m-2 rounded-lg">
          {/* Header */}
          <div className="gradient-primary py-6 px-8 text-center text-primary-foreground">
            <div className="flex justify-center mb-3">
              <div className="bg-primary-foreground/20 rounded-full p-3">
                <Award className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-wide">CERTIFICATE</h1>
            <p className="text-primary-foreground/80 text-sm mt-1 tracking-widest uppercase">of Blood Donation</p>
          </div>

          {/* Body */}
          <div className="px-8 py-10 text-center space-y-6">
            <p className="text-muted-foreground text-sm">This is to certify that</p>

            <div className="py-2">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary border-b-2 border-primary/30 inline-block pb-2 px-4">
                {data.full_name}
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              has voluntarily donated blood at the <strong className="text-foreground">{data.camp?.name || "Blood Donation Camp"}</strong> organized
              by <strong className="text-foreground">{data.camp?.organizer || "eBloodBank"}</strong> and has made a noble contribution towards saving lives.
            </p>


            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto text-sm py-4">
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary">
                <Droplets className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Blood Group</span>
                <strong className="text-lg text-primary">{data.blood_group}</strong>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Date</span>
                <strong className="text-foreground">{donatedDate}</strong>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-secondary col-span-2 md:col-span-1">
                <User className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Certificate ID</span>
                <strong className="text-foreground text-xs">{data.certificate_id}</strong>
              </div>
            </div>

            {camp && (
              <p className="text-xs text-muted-foreground">
                Camp Location: {camp.address}, {camp.district}, {camp.state}
              </p>
            )}

            {/* Quote */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-center mb-2">
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </div>
              <p className="text-sm italic text-muted-foreground">
                "Every drop of blood donated is a gift of life. Thank you for being a hero."
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-8 px-4">
              <div className="text-center">
                <div className="w-32 border-t border-foreground/30 mb-1"></div>
                <p className="text-xs text-muted-foreground">Camp Coordinator</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Droplets className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-heading font-bold text-primary">eBloodBank</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-foreground/30 mb-1"></div>
                <p className="text-xs text-muted-foreground">Medical Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
