import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Download, CheckCircle, AlertCircle, FileText, Users, Lightbulb, Target, Globe } from 'lucide-react';
import { WorkflowResponse } from '../services/brandResearchApi';

interface BrandResearchResultsProps {
  results: WorkflowResponse;
  onClose: () => void;
  onDownload: () => void;
}

export default function BrandResearchResults({ results, onClose, onDownload }: BrandResearchResultsProps) {
  const formatResults = (data: any) => {
    if (!data) return 'No data available';
    
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  const getNodeIcon = (nodeName: string) => {
    switch (nodeName) {
      case 'node_a':
        return <Globe className="w-4 h-4" />;
      case 'node_a_plus':
        return <FileText className="w-4 h-4" />;
      case 'node_b':
        return <Users className="w-4 h-4" />;
      case 'node_e':
        return <Users className="w-4 h-4" />;
      case 'node_c':
        return <Lightbulb className="w-4 h-4" />;
      case 'node_d':
        return <Target className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getNodeTitle = (nodeName: string) => {
    switch (nodeName) {
      case 'node_a':
        return 'Evidence Extraction';
      case 'node_a_plus':
        return 'Data Merging';
      case 'node_b':
        return 'Competitor Analysis';
      case 'node_e':
        return 'Competitor Ad Analysis';
      case 'node_c':
        return 'Research Insights';
      case 'node_d':
        return 'Refined Strategy';
      default:
        return 'Completed';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Brand Research Complete!</h2>
              <p className="text-gray-600">Your brand research has been successfully completed</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Research Completed Successfully</h3>
                  <p className="text-green-700">
                    {results.message || 'All workflow nodes have been executed successfully and your brand research is ready.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Execution Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Execution Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Execution ID</label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                      {results.data?.execution_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {results.data?.status || 'completed'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Workflow Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['node_a', 'node_a_plus', 'node_b', 'node_e', 'node_c', 'node_d'].map((node, index) => (
                    <div key={node} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getNodeIcon(node)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{getNodeTitle(node)}</h4>
                        <p className="text-sm text-gray-600">Step {index + 1} of 6</p>
                      </div>
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Extracted Evidence */}
            {results.data?.extracted_evidence && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Extracted Evidence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.data.extracted_evidence.verbal_identity && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verbal Identity</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {typeof results.data.extracted_evidence.verbal_identity === 'string'
                          ? results.data.extracted_evidence.verbal_identity
                          : <span className="whitespace-pre-wrap text-xs">{JSON.stringify(results.data.extracted_evidence.verbal_identity, null, 2)}</span>}
                      </p>
                    </div>
                  )}
                  
                  {results.data.extracted_evidence.tone_adjectives && results.data.extracted_evidence.tone_adjectives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tone Adjectives</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.data.extracted_evidence.tone_adjectives.map((adj: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {adj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.data.extracted_evidence.positioning && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Positioning</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {typeof results.data.extracted_evidence.positioning === 'string'
                          ? results.data.extracted_evidence.positioning
                          : <span className="whitespace-pre-wrap text-xs">{JSON.stringify(results.data.extracted_evidence.positioning, null, 2)}</span>}
                      </p>
                    </div>
                  )}
                  
                  {results.data.extracted_evidence.audience_insights && results.data.extracted_evidence.audience_insights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Audience Insights</h4>
                      <ul className="space-y-1">
                        {results.data.extracted_evidence.audience_insights.slice(0, 5).map((insight: string, index: number) => (
                          <li key={index} className="text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.data.extracted_evidence.scraped_content && results.data.extracted_evidence.scraped_content.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Web Scraping Results</h4>
                      <div className="space-y-2">
                        {results.data.extracted_evidence.scraped_content.slice(0, 3).map((content: any, index: number) => (
                          <div key={index} className="border rounded p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{content.url}</h5>
                              {content.error ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                  Error
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                  Success
                                </Badge>
                              )}
                            </div>
                            {content.error ? (
                              <p className="text-red-600 text-sm">{content.error}</p>
                            ) : (
                              <div className="text-sm text-gray-600">
                                <p><span className="font-medium">Title:</span> {content.title || 'N/A'}</p>
                                <p><span className="font-medium">Content Length:</span> {content.text_content?.length || 0} characters</p>
                                {content.pricing_info && (
                                  <p><span className="font-medium">Pricing:</span> {content.pricing_info}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Competitors */}
            {results.data?.competitors && results.data.competitors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Competitors Identified</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.data.competitors.slice(0, 5).map((competitor: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {typeof competitor.similarity_score === 'number' ? Math.round(competitor.similarity_score * 100) : competitor.similarity_score}% similar
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Category:</span> {competitor.category}</p>
                          <p><span className="font-medium">Price Tier:</span> {competitor.price_tier}</p>
                          {competitor.description && (
                            <p><span className="font-medium">Description:</span> {competitor.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Node E: Competitor Ad Analysis Overview */}
            {(results.data?.competitor_analysis_overview || results.data?.competitor_ads_raw) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Competitor Ad Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.data?.competitor_analysis_overview && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(results.data.competitor_analysis_overview, null, 2)}</pre>
                    </div>
                  )}
                  {results.data?.competitor_gemini_insights && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-semibold mb-2">Per-competitor Insights</h4>
                      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(results.data.competitor_gemini_insights, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Research Insights */}
            {results.data?.research_insights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Research Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.data.research_insights.key_insights && results.data.research_insights.key_insights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                      <ul className="space-y-2">
                        {results.data.research_insights.key_insights.map((insight: string, index: number) => (
                          <li key={index} className="text-gray-700 flex items-start">
                            <span className="text-yellow-500 mr-2">💡</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.data.research_insights.positioning_statement && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Positioning Statement</h4>
                      <p className="text-gray-700 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                        {results.data.research_insights.positioning_statement}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Refined Insights / Creative Strategy */}
            {results.data?.refined_insights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Creative Strategy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.data.refined_insights.messaging_framework_smp_text && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Strategic Message Platform</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {results.data.refined_insights.messaging_framework_smp_text}
                      </p>
                    </div>
                  )}
                  
                  {results.data.refined_insights.hook_bank && results.data.refined_insights.hook_bank.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hook Bank</h4>
                      <div className="space-y-2">
                        {results.data.refined_insights.hook_bank.slice(0, 5).map((hook: any, index: number) => (
                          <div key={index} className="border rounded p-2 bg-gray-50">
                            <p className="font-medium text-gray-900">{hook.hook}</p>
                            <p className="text-sm text-gray-600">{hook.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.data.refined_insights.cta_set && results.data.refined_insights.cta_set.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Call-to-Action Set</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.data.refined_insights.cta_set.map((cta: any, index: number) => (
                          <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                            {cta.cta}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Raw Data (Collapsible) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Raw Data (JSON)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-sm">
                  <pre>{formatResults(results.data)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Research completed at {new Date().toLocaleString()}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={onDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
