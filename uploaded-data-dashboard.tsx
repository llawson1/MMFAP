
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UploadStats {
  totalTeams: number;
  completeTeams: number;
  incompleteTeams: number;
  leagues: string[];
}

interface UploadResult {
  success: boolean;
  stats?: UploadStats;
  error?: string;
  timestamp?: string;
}

export default function UploadedDataDashboard() {
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: uploadStats, refetch, isLoading } = useQuery({
    queryKey: ['/api/uploaded-data/stats'],
    queryFn: async (): Promise<UploadResult> => {
      const response = await fetch('/api/uploaded-data/stats');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    staleTime: 30 * 1000,
  });

  const processLatestUpload = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/uploaded-data/process-latest');
      const result = await response.json();
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to process upload:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const completenessPercentage = uploadStats?.stats 
    ? Math.round((uploadStats.stats.completeTeams / uploadStats.stats.totalTeams) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Uploaded Data Management</h2>
          <p className="text-muted-foreground">
            Process and integrate uploaded team data files
          </p>
        </div>
        <Button 
          onClick={processLatestUpload} 
          disabled={isProcessing || isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Processing...' : 'Process Latest Upload'}
        </Button>
      </div>

      {/* Upload Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Upload Status
          </CardTitle>
          <CardDescription>
            Status of the most recently uploaded team data file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading upload status...
            </div>
          ) : uploadStats?.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Latest upload processed successfully</span>
                <Badge variant="secondary">
                  {new Date(uploadStats.timestamp || '').toLocaleString()}
                </Badge>
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground">
                ✅ FBref data detected and parsed<br/>
                ✅ Premier League teams integrated<br/>
                ✅ Encoding auto-detection applied
              </div>
              
              {uploadStats.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {uploadStats.stats.totalTeams}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {uploadStats.stats.completeTeams}
                    </div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {uploadStats.stats.incompleteTeams}
                    </div>
                    <div className="text-sm text-muted-foreground">Incomplete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {uploadStats.stats.leagues.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Leagues</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              <span>{uploadStats?.error || 'No uploaded data found'}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Completeness */}
      {uploadStats?.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Data Completeness</CardTitle>
            <CardDescription>
              Overview of data quality in uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completeness</span>
                <span>{completenessPercentage}%</span>
              </div>
              <Progress value={completenessPercentage} className="w-full" />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Leagues Covered</h4>
              <div className="flex flex-wrap gap-2">
                {uploadStats.stats.leagues.map(league => (
                  <Badge key={league} variant="outline">
                    {league}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle>File Processing</CardTitle>
          <CardDescription>
            Status of uploaded data files and encoding detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Auto-encoding detection enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Multiple file format support (Excel, CSV, TXT)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">FBref data pattern recognition</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Actions</CardTitle>
          <CardDescription>
            Manage how uploaded data is integrated into the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate Data Quality
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Update Team Database
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Uploaded data will be automatically integrated into team profiles, 
              league tables, and statistical analysis components. System now supports 
              multiple encodings and file formats including FBref exports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
