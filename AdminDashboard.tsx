import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminCamps from './admin/AdminCamps';
import AdminIssues from './admin/AdminIssues';
import { LayoutDashboard, Users as UsersIcon, Building2, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage users, monitor activity, and oversee donation camps.</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" /> <span className="hidden sm:inline">Users</span>
                    </TabsTrigger>
                    <TabsTrigger value="camps" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> <span className="hidden sm:inline">Blood Camps</span>
                    </TabsTrigger>
                    <TabsTrigger value="issues" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> <span className="hidden sm:inline">Issues</span>
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                    <AdminOverview stats={stats} />
                </TabsContent>
                
                <TabsContent value="users" className="mt-6">
                    <AdminUsers />
                </TabsContent>
                
                <TabsContent value="camps" className="mt-6">
                    <AdminCamps />
                </TabsContent>
                
                <TabsContent value="issues" className="mt-6">
                    <AdminIssues />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
