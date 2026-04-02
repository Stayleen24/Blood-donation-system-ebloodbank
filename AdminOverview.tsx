import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Droplets, Building2, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const AdminOverview = ({ stats }: { stats: any }) => {
    if (!stats) return null;

    const inventoryData = stats.inventoryStats?.map((item: any) => ({
        name: item._id,
        value: item.totalUnits
    })) || [];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDonors || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Camps</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCamps || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeIssues || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Blood Inventory Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {inventoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={inventoryData}
                                        cx="50%" cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {inventoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center p-8 text-muted-foreground h-full">No inventory data yet</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Recent Users</h3>
                                {stats.recentActivity?.users?.length > 0 ? (
                                    <ul className="text-sm space-y-2">
                                        {stats.recentActivity.users.map((u: any, i: number) => (
                                            <li key={i} className="flex justify-between items-center border-b pb-1">
                                                <span>{u.full_name || 'Anonymous'} <span className="text-muted-foreground">({u.email})</span></span>
                                                <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No recent users</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Recent Issues</h3>
                                {stats.recentActivity?.issues?.length > 0 ? (
                                    <ul className="text-sm space-y-2">
                                        {stats.recentActivity.issues.map((issue: any, i: number) => (
                                            <li key={i} className="flex justify-between items-center border-b pb-1">
                                                <span>{issue.subject}</span>
                                                <span className="text-xs text-muted-foreground">by {issue.reported_by?.full_name || 'Unknown'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-muted-foreground">No recent issues</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
