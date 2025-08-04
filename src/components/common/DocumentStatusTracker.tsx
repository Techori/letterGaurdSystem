
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, XCircle, FileText, Send, Archive } from 'lucide-react';

interface WorkflowStep {
  name: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  date?: string;
}

interface DocumentStatusTrackerProps {
  documentId: string;
  currentStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  steps?: WorkflowStep[];
}

export function DocumentStatusTracker({ documentId, currentStatus, steps }: DocumentStatusTrackerProps) {
  const defaultSteps: WorkflowStep[] = [
    { name: 'Draft Created', status: 'completed', date: '2024-01-15' },
    { name: 'Under Review', status: currentStatus === 'draft' ? 'current' : 'completed', date: currentStatus !== 'draft' ? '2024-01-16' : undefined },
    { name: 'Admin Approval', status: currentStatus === 'approved' ? 'completed' : currentStatus === 'rejected' ? 'rejected' : currentStatus === 'pending' ? 'current' : 'pending' },
    { name: 'Document Active', status: currentStatus === 'approved' ? 'completed' : 'pending' }
  ];

  const workflowSteps = steps || defaultSteps;
  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const progress = Math.round((completedSteps / workflowSteps.length) * 100);

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100">Draft</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Status
          </CardTitle>
          {getStatusBadge(currentStatus)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              {getStepIcon(step.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    step.status === 'completed' ? 'text-green-700' : 
                    step.status === 'current' ? 'text-blue-700' : 
                    step.status === 'rejected' ? 'text-red-700' : 
                    'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {step.date && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(step.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
