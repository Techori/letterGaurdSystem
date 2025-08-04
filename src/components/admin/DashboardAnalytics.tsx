import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';
import { documentService } from '@/services/documentService';

interface AnalyticsData {
  totalDocuments: number;
  pendingApprovals: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  monthlyData: Array<{
    month: string;
    documents: number;
    approved: number;
    rejected: number;
  }>;
  departmentData: Array<{
    name: string;
    documents: number;
  }>;
  documentTypeData: Array<{
    type: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const documents = await documentService.getAll();

      // Process monthly data
      const monthlyMap = new Map();
      documents.forEach(doc => {
        const month = new Date(doc.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { month, documents: 0, approved: 0, rejected: 0 });
        }
        
        const data = monthlyMap.get(month);
        data.documents++;
        if (doc.status === 'Approved') data.approved++;
        if (doc.status === 'Rejected') data.rejected++;
      });

      // Process department data
      const deptMap = new Map();
      documents.forEach(doc => {
        const deptName = doc.department || 'Unknown';
        deptMap.set(deptName, (deptMap.get(deptName) || 0) + 1);
      });

      // Process document type data
      const typeMap = new Map();
      documents.forEach(doc => {
        const type = doc.letterType;
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      });

      const totalDocuments = documents.length;
      const pendingApprovals = documents.filter(d => d.status === 'Pending').length;
      const approvedDocuments = documents.filter(d => d.status === 'Approved').length;
      const rejectedDocuments = documents.filter(d => d.status === 'Rejected').length;

      setAnalytics({
        totalDocuments,
        pendingApprovals,
        approvedDocuments,
        rejectedDocuments,
        monthlyData: Array.from(monthlyMap.values()).slice(-6),
        departmentData: Array.from(deptMap.entries()).map(([name, documents]) => ({ name, documents })),
        documentTypeData: Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }))
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              All time documents created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.approvedDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalDocuments > 0 
                ? Math.round((analytics.approvedDocuments / analytics.totalDocuments) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Document Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="documents" fill="#8884d8" name="Total" />
                <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                <Bar dataKey="rejected" fill="#ff7c7c" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="documents"
                >
                  {analytics.departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.documentTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{item.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.totalDocuments) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
