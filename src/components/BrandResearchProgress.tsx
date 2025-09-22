import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Download, CheckCircle, AlertCircle, Loader2, Globe, Users, Lightbulb, Target } from 'lucide-react';
import { WorkflowProgress, WorkflowResponse } from '../services/brandResearchApi';

interface BrandResearchProgressProps {
  executionId: string;
  progress?: WorkflowProgress | null;
  onComplete: (results: WorkflowResponse) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

const nodeInfo = {
  'node_a': {
    title: 'Evidence Extraction',
    description: 'Scraping and analyzing landing pages',
    icon: Globe,
    color: 'bg-blue-500'
  },
  'node_a_plus': {
    title: 'Data Merging',
    description: 'Combining and processing extracted data',
    icon: CheckCircle,
    color: 'bg-purple-500'
  },
  'node_b': {
    title: 'Competitor Analysis',
    description: 'Identifying and analyzing competitors',
    icon: Users,
    color: 'bg-green-500'
  },
  'node_e': {
    title: 'Competitor Ad Analysis',
    description: 'Fetching ads and analyzing video creatives',
    icon: Users,
    color: 'bg-indigo-500'
  },
  'node_c': {
    title: 'Research Insights',
    description: 'Generating strategic insights',
    icon: Lightbulb,
    color: 'bg-yellow-500'
  },
  'node_d': {
    title: 'Refined Strategy',
    description: 'Finalizing creative strategy',
    icon: Target,
    color: 'bg-red-500'
  }
};

export default function BrandResearchProgress({ executionId, progress: propProgress, onComplete, onError, onClose }: BrandResearchProgressProps) {
  const [internalProgress, setInternalProgress] = useState<WorkflowProgress | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Use prop progress or internal progress
  const progress = propProgress || internalProgress;

  // Initialize with starting progress if none provided
  useEffect(() => {
    if (!progress) {
      const initialProgress = {
        execution_id: executionId,
        current_node: 'starting',
        status: 'running' as const,
        progress_percentage: 0,
        details: {
          current_operation: 'Initializing workflow...',
          pages_scraped: 0,
          total_pages: 0,
          extracted_data: {},
          errors: []
        }
      };
      setInternalProgress(initialProgress);
    }
  }, [executionId, progress]);

  useEffect(() => {
    // This will be handled by the parent component
    // The parent will call the monitoring function and pass progress updates
  }, []);

  const getNodeStatus = (nodeName: string) => {
    if (!progress) return 'pending';
    
    const nodeOrder = ['node_a', 'node_a_plus', 'node_b', 'node_e', 'node_c', 'node_d'];
    const currentIndex = nodeOrder.indexOf(progress.current_node);
    const nodeIndex = nodeOrder.indexOf(nodeName);
    
    if (nodeIndex < currentIndex) return 'completed';
    if (nodeIndex === currentIndex) return 'current';
    return 'pending';
  };

  const downloadResults = () => {
    if (progress?.details?.extracted_data) {
      const dataStr = JSON.stringify(progress.details.extracted_data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `brand-research-${executionId}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className={`w-5 h-5 ${isMonitoring ? 'animate-spin' : ''}`} />
              <span>Brand Research Progress</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {progress?.status === 'completed' && (
                <Button onClick={downloadResults} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Results
                </Button>
              )}
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <Badge variant={progress?.status === 'completed' ? 'default' : 'secondary'}>
                {progress?.progress_percentage || 0}%
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress?.progress_percentage || 0}%` }}
              />
            </div>
            
            {progress?.details?.current_operation && (
              <p className="text-sm text-gray-600 text-center">
                {progress.details.current_operation}
              </p>
            )}
          </div>

          {/* Current Operation Details */}
          {progress?.details && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Current Operation Details</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current Node:</span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {progress.current_node}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <span className={`font-medium px-2 py-1 rounded ${
                    progress.status === 'completed' ? 'bg-green-100 text-green-800' :
                    progress.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {progress.status}
                  </span>
                </div>
                
                {progress.details.pages_scraped !== undefined && progress.details.total_pages !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Pages Scraped:</span>
                    <span className="font-medium">
                      {progress.details.pages_scraped} / {progress.details.total_pages}
                    </span>
                  </div>
                )}
                
                {progress.details.current_operation && (
                  <div className="text-sm">
                    <span className="font-medium">Operation: </span>
                    <span>{progress.details.current_operation}</span>
                  </div>
                )}
              </div>
              
              {progress.details.errors && progress.details.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-red-600">Errors:</h5>
                  {progress.details.errors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Workflow Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Workflow Steps</h3>
            
            <div className="space-y-3">
              {Object.entries(nodeInfo).map(([nodeName, info]) => {
                const status = getNodeStatus(nodeName);
                const Icon = info.icon;
                
                return (
                  <div key={nodeName} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status === 'completed' ? 'bg-green-100 text-green-600' :
                      status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : status === 'current' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        status === 'completed' ? 'text-green-900' :
                        status === 'current' ? 'text-blue-900' :
                        'text-gray-500'
                      }`}>
                        {info.title}
                      </h4>
                      <p className={`text-sm ${
                        status === 'completed' ? 'text-green-600' :
                        status === 'current' ? 'text-blue-600' :
                        'text-gray-400'
                      }`}>
                        {info.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {status === 'completed' && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                      {status === 'current' && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      )}
                      {status === 'pending' && (
                        <Badge variant="outline">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Log */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Real-time Log</h3>
            
            <div className="bg-black text-green-400 rounded-lg p-4 max-h-40 overflow-y-auto font-mono text-sm">
              <div className="space-y-1">
                <div>🚀 Starting brand research workflow...</div>
                {progress?.current_node && (
                  <div>⚡ Executing {progress.current_node}...</div>
                )}
                {progress?.details?.current_operation && (
                  <div>📊 {progress.details.current_operation}</div>
                )}
                {progress?.details?.pages_scraped !== undefined && progress?.details?.total_pages !== undefined && (
                  <div>🌐 Scraped {progress.details.pages_scraped} of {progress.details.total_pages} pages</div>
                )}
                {progress?.status === 'completed' && (
                  <div>✅ Workflow completed successfully!</div>
                )}
              </div>
            </div>
          </div>

          {/* Extracted Data Preview */}
          {progress?.details?.extracted_data && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Extracted Data Preview</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(progress.details.extracted_data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
