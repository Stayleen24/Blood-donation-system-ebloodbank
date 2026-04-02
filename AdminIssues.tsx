import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';

const AdminIssues = () => {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchIssues = async () => {
        try {
            const res = await api.get('/admin/issues');
            setIssues(res.data);
        } catch (error) {
            toast({ title: "Failed to fetch issues", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const resolveIssue = async (id: string) => {
        try {
            await api.put(`/admin/issues/${id}/resolve`);
            toast({ title: "Issue resolved successfully" });
            fetchIssues();
        } catch (error) {
            toast({ title: "Failed to resolve issue", variant: "destructive" });
        }
    };

    if (loading) return <div className="text-center p-4">Loading issues...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reported Issues & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Reported By</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map(issue => (
                                <TableRow key={issue._id}>
                                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{issue.reported_by?.full_name || issue.reported_by?.email || 'System'}</TableCell>
                                    <TableCell className="font-medium">{issue.subject}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={issue.description}>{issue.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={issue.status === 'resolved' ? "secondary" : "destructive"}>
                                            {issue.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {issue.status !== 'resolved' && (
                                            <Button size="sm" variant="outline" onClick={() => resolveIssue(issue._id)}>
                                                <CheckCircle className="w-4 h-4 mr-1 text-success" /> Resolve
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {issues.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                        No issues reported.
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

export default AdminIssues;
