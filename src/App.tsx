import { useState } from 'react';
import { Target, Users, Video, User, Download, Search, Upload } from 'lucide-react';
import BriefForm from './components/BriefForm';
import BrandResearchProgress from './components/BrandResearchProgress';
import BrandResearchResults from './components/BrandResearchResults';
import { Button } from './components/ui/Button';
import { brandResearchApi, WorkflowProgress, WorkflowResponse } from './services/brandResearchApi';

interface BriefFormData {
  section_1_campaign_strategy_objective: {
    business_goal: { selected: string[], options: string[], other_text: string };
    marketing_objective: string;
    primary_kpi_target: { selected: string[], options: string[], other_text: string };
    cta: { selected: string, options: string[], other_text: string };
    reason_now: string;
  };
  section_2_audience_positioning: {
    audiences: Array<{
      id: string;
      target_demographics: string;
      target_psychographics: string;
      geo_allow: string;
      geo_deny: string;
      familiarity_level: string;
      key_takeaway: string;
    }>;
    differentiator: string;
    offers_promotions: string[];
  };
  section_3_creative_delivery_context: {
    channels_platforms: { selected: string[], options: string[], other_text: string };
    video_duration: { selected: string[], options: string[], other_text: string };
    voiceover: {
      required: boolean;
      style: string;
    };
    assets_to_use: string[];
    brand_guidelines: string;
    winning_ads: string[];
    reference_videos: string[];
    additional_links: string[];
  };
  section_4_tone_emotion: {
    desired_feelings: { selected: string[], options: string[], other_text: string };
    message_style: string;
    brand_role: string;
    brand_tone_overall: string;
    creative_direction: string;
  };
  section_6_personalization_inputs: {
    personalizations: Array<{
      id: string;
      audience_id: string;
      languages: string[];
      lengths: string[];
      ratios: string[];
    }>;
  };
  section_5_brand_research: {
    landing_page_links: Array<{ url: string }>;
    social_media_links: Array<{ platform: string; handle_or_url: string }>;
  };
}

function App() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isResearchInProgress, setIsResearchInProgress] = useState(false);
  const [researchProgress, setResearchProgress] = useState<WorkflowProgress | null>(null);
  const [researchResults, setResearchResults] = useState<WorkflowResponse | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [formData, setFormData] = useState<BriefFormData>({
    section_1_campaign_strategy_objective: {
      business_goal: { 
        selected: [], 
        options: ["Awareness", "Consideration", "Conversion"], 
        other_text: "" 
      },
      marketing_objective: '',
      primary_kpi_target: { 
        selected: [], 
        options: ["3s hold", "50% VTR", "CTR", "CVR", "CPA", "ROAS", "Brand Lift"], 
        other_text: "" 
      },
      cta: { 
        selected: '', 
        options: ["Buy Now", "Sign Up", "Visit Website", "Book Demo", "Learn More"], 
        other_text: "" 
      },
      reason_now: ''
    },
    section_2_audience_positioning: {
      audiences: [],
      differentiator: '',
      offers_promotions: []
    },
    section_3_creative_delivery_context: {
      channels_platforms: { 
        selected: [], 
        options: ["Meta Reels", "YouTube Shorts", "OTT/CTV", "Display", "CRM/Email/WhatsApp"], 
        other_text: "" 
      },
      video_duration: { 
        selected: [], 
        options: ["6s", "15s", "30s", "60s"], 
        other_text: "" 
      },
      voiceover: {
        required: false,
        style: ''
      },
      assets_to_use: [],
      brand_guidelines: '',
      winning_ads: [],
      reference_videos: [],
      additional_links: []
    },
    section_4_tone_emotion: {
      desired_feelings: { 
        selected: [], 
        options: ["Uplifted", "Urgent", "Celebratory", "Reassured", "Playful", "Inspired", "Empowered", "Curious", "Warm", "Informed"], 
        other_text: "" 
      },
      message_style: '',
      brand_role: '',
      brand_tone_overall: '',
      creative_direction: ''
    },
    section_6_personalization_inputs: {
      personalizations: []
    },
    section_5_brand_research: {
      landing_page_links: [],
      social_media_links: []
    }
  });

  const downloadJSON = () => {
    const briefData = {
      campaign_id: 'new-campaign',
      brief_data: formData,
      research_results: researchResults?.data || null
    };

    const dataStr = JSON.stringify(briefData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `campaign-brief-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const startBrandResearch = async () => {
    try {
      setIsResearchInProgress(true);
      setResearchError(null);
      setResearchResults(null);
      setResearchProgress(null);

      // Check if brand research inputs are provided
      if (formData.section_5_brand_research.landing_page_links.length === 0 && 
          formData.section_5_brand_research.social_media_links.length === 0) {
        setResearchError('Please add at least one landing page link or social media link to start brand research.');
        setIsResearchInProgress(false);
        return;
      }

      // Check API health
      const isHealthy = await brandResearchApi.healthCheck();
      if (!isHealthy) {
        setResearchError('Brand research API is not available. Please check if the service is running.');
        setIsResearchInProgress(false);
        return;
      }

      // Prepare brand research input
      const researchInput = {
        brand_brief: formData,
        lp_links: formData.section_5_brand_research.landing_page_links,
        social_links: formData.section_5_brand_research.social_media_links
      };

      // Start workflow
      const startResponse = await brandResearchApi.startWorkflow(researchInput);
      
      if (!startResponse.success) {
        throw new Error(startResponse.message);
      }

      const executionId = startResponse.data?.execution_id;
      if (!executionId) {
        throw new Error('No execution ID returned from workflow start');
      }

      // Start monitoring progress immediately after starting workflow
                await brandResearchApi.monitorWorkflowProgress(
                  executionId,
                  (progress) => {
                    console.log('Progress update:', progress);
                    setResearchProgress(progress);
                  },
                  (results) => {
                    console.log('Workflow completed:', results);
                    setResearchResults(results);
                    setIsResearchInProgress(false);
                    setShowResultsModal(true);
                  },
                  (error) => {
                    console.error('Workflow error:', error);
                    setResearchError(error.message);
                    setIsResearchInProgress(false);
                  }
                );

    } catch (error) {
      setResearchError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsResearchInProgress(false);
    }
  };

  const closeResearchProgress = () => {
    setIsResearchInProgress(false);
    setResearchProgress(null);
    setResearchError(null);
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  const downloadResults = () => {
    if (!researchResults) return;
    
    const resultsData = {
      brief_data: formData,
      research_results: researchResults,
      generated_at: new Date().toISOString(),
      execution_id: researchResults.data?.execution_id
    };

    const dataStr = JSON.stringify(resultsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', `brand-research-results-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Check if it's a valid brief format
        if (jsonData.brief_data) {
          // Merge with default form data to ensure all properties exist
          const mergedData = {
            ...formData,
            ...jsonData.brief_data,
            // Ensure nested objects have default values
            section_1_campaign_strategy_objective: {
              ...formData.section_1_campaign_strategy_objective,
              ...jsonData.brief_data.section_1_campaign_strategy_objective,
              business_goal: {
                ...formData.section_1_campaign_strategy_objective.business_goal,
                ...jsonData.brief_data.section_1_campaign_strategy_objective?.business_goal
              },
              primary_kpi_target: {
                ...formData.section_1_campaign_strategy_objective.primary_kpi_target,
                ...jsonData.brief_data.section_1_campaign_strategy_objective?.primary_kpi_target
              },
              cta: {
                ...formData.section_1_campaign_strategy_objective.cta,
                ...jsonData.brief_data.section_1_campaign_strategy_objective?.cta
              }
            },
            section_2_audience_positioning: {
              ...formData.section_2_audience_positioning,
              ...jsonData.brief_data.section_2_audience_positioning,
              audiences: jsonData.brief_data.section_2_audience_positioning?.audiences || []
            },
            section_3_creative_delivery_context: {
              ...formData.section_3_creative_delivery_context,
              ...jsonData.brief_data.section_3_creative_delivery_context,
              channels_platforms: {
                ...formData.section_3_creative_delivery_context.channels_platforms,
                ...jsonData.brief_data.section_3_creative_delivery_context?.channels_platforms
              },
              video_duration: {
                ...formData.section_3_creative_delivery_context.video_duration,
                ...jsonData.brief_data.section_3_creative_delivery_context?.video_duration
              },
              voiceover: {
                ...formData.section_3_creative_delivery_context.voiceover,
                ...jsonData.brief_data.section_3_creative_delivery_context?.voiceover
              }
            },
            section_4_tone_emotion: {
              ...formData.section_4_tone_emotion,
              ...jsonData.brief_data.section_4_tone_emotion,
              desired_feelings: {
                ...formData.section_4_tone_emotion.desired_feelings,
                ...jsonData.brief_data.section_4_tone_emotion?.desired_feelings
              }
            },
            section_5_brand_research: {
              ...formData.section_5_brand_research,
              ...jsonData.brief_data.section_5_brand_research,
              landing_page_links: jsonData.brief_data.section_5_brand_research?.landing_page_links || [],
              social_media_links: jsonData.brief_data.section_5_brand_research?.social_media_links || []
            },
            section_6_personalization_inputs: {
              ...formData.section_6_personalization_inputs,
              ...jsonData.brief_data.section_6_personalization_inputs,
              personalizations: jsonData.brief_data.section_6_personalization_inputs?.personalizations || []
            }
          };
          
          setFormData(mergedData);
          setResearchResults(jsonData.research_results ? { success: true, message: 'Research results loaded', data: jsonData.research_results } : null);
          setShowUploadModal(false);
          alert('Brief data loaded successfully!');
        } else {
          alert('Invalid JSON format. Please upload a valid brief JSON file.');
        }
      } catch (error) {
        alert('Error parsing JSON file. Please make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const canSave = formData.section_1_campaign_strategy_objective.business_goal.selected.length > 0 && 
                 formData.section_2_audience_positioning.audiences.length > 0;

  const sections = [
    { id: 1, title: "Strategy & Objective", icon: Target },
    { id: 2, title: "Audience Positioning", icon: Users },
    { id: 3, title: "Creative & Tone", icon: Video },
    { id: 4, title: "Personalization", icon: User },
    { id: 5, title: "Brand Research", icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Brief Creator</h1>
            <p className="text-gray-600 mt-1">Create comprehensive campaign briefs with ease</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload JSON
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </button>
            <button
              onClick={startBrandResearch}
              disabled={!canSave || isResearchInProgress}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResearchInProgress ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Start Brand Research
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-2 border-b mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                  currentSection === section.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <BriefForm
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Brief Progress</h3>
              <div className="space-y-3">
                {sections.map((section) => {
                  let completed = false;
                  let percentage = 0;

                  switch (section.id) {
                    case 1:
                      completed = formData.section_1_campaign_strategy_objective.business_goal.selected.length > 0;
                      const fields1 = [
                        formData.section_1_campaign_strategy_objective.business_goal.selected.length > 0,
                        formData.section_1_campaign_strategy_objective.marketing_objective.trim().length > 0,
                        formData.section_1_campaign_strategy_objective.primary_kpi_target.selected.length > 0,
                        formData.section_1_campaign_strategy_objective.cta.selected.length > 0,
                        formData.section_1_campaign_strategy_objective.reason_now.trim().length > 0,
                        formData.section_2_audience_positioning.differentiator.trim().length > 0,
                        formData.section_2_audience_positioning.offers_promotions.length > 0
                      ];
                      percentage = Math.round((fields1.filter(Boolean).length / fields1.length) * 100);
                      break;
                    case 2:
                      completed = formData.section_2_audience_positioning.audiences.length > 0;
                      const audiences = formData.section_2_audience_positioning.audiences;
                      if (audiences.length === 0) {
                        percentage = 0;
                      } else {
                        const fieldsPerAudience = 6;
                        const totalFields = audiences.length * fieldsPerAudience;
                        const filledFields = audiences.reduce((count, audience) => {
                          return count + [
                            audience.target_demographics.trim().length > 0,
                            audience.target_psychographics.trim().length > 0,
                            audience.geo_allow.trim().length > 0,
                            audience.geo_deny.trim().length > 0,
                            audience.familiarity_level.length > 0,
                            audience.key_takeaway.trim().length > 0
                          ].filter(Boolean).length;
                        }, 0);
                        percentage = Math.round((filledFields / totalFields) * 100);
                      }
                      break;
                    case 3:
                      completed = formData.section_3_creative_delivery_context.channels_platforms.selected.length > 0;
                      const fields3 = [
                        formData.section_3_creative_delivery_context.channels_platforms.selected.length > 0,
                        formData.section_3_creative_delivery_context.voiceover.required || formData.section_3_creative_delivery_context.voiceover.style.trim().length > 0,
                        formData.section_3_creative_delivery_context.brand_guidelines.trim().length > 0,
                        formData.section_3_creative_delivery_context.winning_ads.length > 0,
                        formData.section_3_creative_delivery_context.reference_videos.length > 0,
                        formData.section_3_creative_delivery_context.additional_links.length > 0,
                        formData.section_4_tone_emotion.desired_feelings.selected.length > 0,
                        formData.section_4_tone_emotion.message_style.length > 0,
                        formData.section_4_tone_emotion.brand_role.length > 0,
                        formData.section_4_tone_emotion.brand_tone_overall.trim().length > 0,
                        (formData.section_4_tone_emotion.creative_direction || '').trim().length > 0
                      ];
                      percentage = Math.round((fields3.filter(Boolean).length / fields3.length) * 100);
                      break;
                    case 4:
                      completed = formData.section_6_personalization_inputs?.personalizations?.length > 0;
                      percentage = completed ? 100 : 0;
                      break;
                    case 5:
                      completed = formData.section_5_brand_research.landing_page_links.length > 0 || 
                                 formData.section_5_brand_research.social_media_links.length > 0;
                      const fields5 = [
                        formData.section_5_brand_research.landing_page_links.length > 0,
                        formData.section_5_brand_research.social_media_links.length > 0
                      ];
                      percentage = Math.round((fields5.filter(Boolean).length / fields5.length) * 100);
                      break;
                  }

                  return (
                    <div key={section.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{section.title}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 text-center">
                  {sections.filter(s => {
                    switch(s.id) {
                      case 1: return formData.section_1_campaign_strategy_objective.business_goal.selected.length > 0;
                      case 2: return formData.section_2_audience_positioning.audiences.length > 0;
                      case 3: return formData.section_3_creative_delivery_context.channels_platforms.selected.length > 0;
                      case 4: return formData.section_6_personalization_inputs?.personalizations?.length > 0;
                      case 5: return formData.section_5_brand_research.landing_page_links.length > 0 || 
                                   formData.section_5_brand_research.social_media_links.length > 0;
                      default: return true;
                    }
                  }).length} of 5 sections completed
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                  disabled={currentSection === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentSection(Math.min(5, currentSection + 1))}
                  disabled={currentSection === 5}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Research Progress Modal */}
      {isResearchInProgress && (
        <BrandResearchProgress
          executionId={researchProgress?.execution_id || 'starting...'}
          progress={researchProgress}
          onComplete={(results) => {
            setResearchResults(results);
            setIsResearchInProgress(false);
          }}
          onError={(error) => {
            setResearchError(error.message);
            setIsResearchInProgress(false);
          }}
          onClose={closeResearchProgress}
        />
      )}

      {/* Brand Research Results Modal */}
      {showResultsModal && researchResults && (
        <BrandResearchResults
          results={researchResults}
          onClose={closeResultsModal}
          onDownload={downloadResults}
        />
      )}

      {/* Error Modal */}
      {researchError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">!</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Research Error</h3>
            </div>
            <p className="text-gray-600 mb-6">{researchError}</p>
            <div className="flex justify-end">
              <Button onClick={() => setResearchError(null)} className="bg-red-600 hover:bg-red-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {researchResults && !isResearchInProgress && !showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Research Complete!</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Brand research has been completed successfully. You can now view detailed results or download the complete brief.
            </p>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setShowResultsModal(true)} className="bg-blue-600 hover:bg-blue-700">
                View Results
              </Button>
              <Button onClick={downloadJSON} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Brief
              </Button>
              <Button onClick={() => setResearchResults(null)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload JSON Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Brief JSON</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Upload a previously downloaded brief JSON file to restore your data and research results.
            </p>
            <div className="space-y-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowUploadModal(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
