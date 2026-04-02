import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarRange, Trash2, Edit } from 'lucide-react';

const AdminCamps = () => {
    const [camps, setCamps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCamps = async () => {
        try {
            const res = await api.get('/blood-camps'); // Fetching from the public route is fine for listing, it returns all.
            setCamps(res.data);
        } catch (error) {
            toast({ title: "Failed to fetch camps", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    const deleteCamp = async (id: string) => {
        if (!confirm('Are you sure you want to delete this camp?')) return;
        try {
            await api.delete(`/admin/blood-camps/${id}`);
            toast({ title: "Camp deleted successfully" });
            fetchCamps();
        } catch (error) {
            toast({ title: "Failed to delete camp", variant: "destructive" });
        }
    };

    if (loading) return <div className="text-center p-4">Loading blood camps...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Blood Donation Camps</CardTitle>
                    <CardDescription>Manage active and upcoming blood donation events.</CardDescription>
                </div>
                {/* For simplicity right now, adding camps could be an entirely new form page or dialog */}
                <Button><CalendarRange className="w-4 h-4 mr-2"/> Add Camp</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {camps.map(camp => (
                                <TableRow key={camp._id}>
                                    <TableCell className="font-medium">{camp.name}</TableCell>
                                    <TableCell>{camp.organizer}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(camp.camp_date).toLocaleDateString()} <br />
                                        <span className="text-xs text-muted-foreground">{camp.start_time} - {camp.end_time}</span>
                                    </TableCell>
                                    <TableCell>{camp.district}, {camp.state}</TableCell>
                                    <TableCell>
                                        <Badge variant={camp.status === 'upcoming' ? "default" : "secondary"}>
                                            {camp.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        <Button size="icon" variant="ghost" className="mr-1"><Edit className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteCamp(camp._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {camps.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                        No blood camps available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminCamps;
