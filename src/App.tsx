import { useState } from 'react';
import { Target, Users, Video, User, Download, Save } from 'lucide-react';
import BriefForm from './components/BriefForm';

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
}

function App() {
  const [currentSection, setCurrentSection] = useState(1);
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
    }
  });

  const downloadJSON = () => {
    const briefData = {
      campaign_id: 'new-campaign',
      brief_data: formData
    };

    const dataStr = JSON.stringify(briefData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `campaign-brief-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const canSave = formData.section_1_campaign_strategy_objective.business_goal.selected.length > 0 && 
                 formData.section_2_audience_positioning.audiences.length > 0;

  const sections = [
    { id: 1, title: "Strategy & Objective", icon: Target },
    { id: 2, title: "Audience Positioning", icon: Users },
    { id: 3, title: "Creative & Tone", icon: Video },
    { id: 4, title: "Personalization", icon: User }
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
              onClick={downloadJSON}
              className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </button>
            <button
              disabled={!canSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Brief
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
                      completed = formData.section_6_personalization_inputs.personalizations.length > 0;
                      percentage = completed ? 100 : 0;
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
                      case 4: return formData.section_6_personalization_inputs.personalizations.length > 0;
                      default: return true;
                    }
                  }).length} of 4 sections completed
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
                  onClick={() => setCurrentSection(Math.min(4, currentSection + 1))}
                  disabled={currentSection === 4}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
