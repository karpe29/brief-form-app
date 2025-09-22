import { useState } from 'react';
import { Target, Users, Video, User, Plus, X, Heart, Upload, Link, Image, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Checkbox } from './ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Badge } from './ui/Badge';
import { Switch } from './ui/Switch';

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

interface BriefFormProps {
  currentSection: number;
  setCurrentSection: (section: number) => void;
  formData: BriefFormData;
  setFormData: React.Dispatch<React.SetStateAction<BriefFormData>>;
}

export default function BriefForm({ currentSection, setCurrentSection, formData, setFormData }: BriefFormProps) {
  const [newItem, setNewItem] = useState('');
  const [currentAudience, setCurrentAudience] = useState({
    target_demographics: '',
    target_psychographics: '',
    geo_allow: '',
    geo_deny: '',
    familiarity_level: '',
    key_takeaway: ''
  });

  // Current personalization form state
  const [currentPersonalization, setCurrentPersonalization] = useState({
    audience_id: '',
    languages: [] as string[],
    lengths: [] as string[],
    ratios: [] as string[]
  });

  // Custom input states
  const [customLanguage, setCustomLanguage] = useState('');
  const [customLength, setCustomLength] = useState('');
  const [customRatio, setCustomRatio] = useState('');

  // Helper functions for form updates
  const updateSection = (section: keyof BriefFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: keyof BriefFormData, parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...(prev[section] as any)[parentField],
          [field]: value
        }
      }
    }));
  };

  const handleMultiSelectChange = (section: keyof BriefFormData, field: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentField = (prev[section] as any)[field] as { selected: string[], options: string[], other_text: string };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...currentField,
            selected: checked 
              ? [...currentField.selected, option]
              : currentField.selected.filter(item => item !== option)
          }
        }
      };
    });
  };

  const addToList = (section: keyof BriefFormData, field: string, item: string) => {
    if (item.trim()) {
      setFormData(prev => {
        const currentList = (prev[section] as any)[field] as string[];
        if (!currentList.includes(item.trim())) {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: [...currentList, item.trim()]
            }
          };
        }
        return prev;
      });
      setNewItem('');
    }
  };


  const addAudience = () => {
    if (currentAudience.key_takeaway.trim()) {
      const newAudience = {
        id: Date.now().toString(),
        ...currentAudience
      };
      
      setFormData(prev => ({
        ...prev,
        section_2_audience_positioning: {
          ...prev.section_2_audience_positioning,
          audiences: [...prev.section_2_audience_positioning.audiences, newAudience]
        }
      }));
      
      // Clear the form
      setCurrentAudience({
        target_demographics: '',
        target_psychographics: '',
        geo_allow: '',
        geo_deny: '',
        familiarity_level: '',
        key_takeaway: ''
      });
    }
  };

  const removeAudience = (audienceId: string) => {
    setFormData(prev => ({
      ...prev,
      section_2_audience_positioning: {
        ...prev.section_2_audience_positioning,
        audiences: prev.section_2_audience_positioning.audiences.filter(audience => audience.id !== audienceId)
      }
    }));
  };

  const addPersonalization = () => {
    if (currentPersonalization.audience_id && 
        (currentPersonalization.languages.length > 0 || currentPersonalization.lengths.length > 0 || currentPersonalization.ratios.length > 0)) {
      const newPersonalization = {
        id: Date.now().toString(),
        ...currentPersonalization
      };
      
      setFormData(prev => ({
        ...prev,
        section_6_personalization_inputs: {
          ...prev.section_6_personalization_inputs,
          personalizations: [...prev.section_6_personalization_inputs.personalizations, newPersonalization]
        }
      }));
      
      // Clear the form
      setCurrentPersonalization({
        audience_id: '',
        languages: [],
        lengths: [],
        ratios: []
      });
    }
  };

  const removePersonalization = (personalizationId: string) => {
    setFormData(prev => ({
      ...prev,
      section_6_personalization_inputs: {
        ...prev.section_6_personalization_inputs,
        personalizations: prev.section_6_personalization_inputs.personalizations.filter(p => p.id !== personalizationId)
      }
    }));
  };

  const togglePersonalizationOption = (dimension: 'languages' | 'lengths' | 'ratios', option: string) => {
    setCurrentPersonalization(prev => ({
      ...prev,
      [dimension]: prev[dimension].includes(option)
        ? prev[dimension].filter(item => item !== option)
        : [...prev[dimension], option]
    }));
  };

  const addCustomOption = (dimension: 'languages' | 'lengths' | 'ratios', value: string) => {
    if (value.trim() && !currentPersonalization[dimension].includes(value.trim())) {
      setCurrentPersonalization(prev => ({
        ...prev,
        [dimension]: [...prev[dimension], value.trim()]
      }));
    }
  };

  const removeCustomOption = (dimension: 'languages' | 'lengths' | 'ratios', option: string) => {
    setCurrentPersonalization(prev => ({
      ...prev,
      [dimension]: prev[dimension].filter(item => item !== option)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Campaign Strategy & Objective */}
      {currentSection === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Campaign Strategy & Objective</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Goal */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Business Goal *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.section_1_campaign_strategy_objective.business_goal.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`business_goal_${option}`}
                      checked={formData.section_1_campaign_strategy_objective.business_goal.selected.includes(option)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('section_1_campaign_strategy_objective', 'business_goal', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`business_goal_${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_goal_other">Other (specify)</Label>
                <Input
                  id="business_goal_other"
                  value={formData.section_1_campaign_strategy_objective.business_goal.other_text}
                  onChange={(e) => updateNestedField('section_1_campaign_strategy_objective', 'business_goal', 'other_text', e.target.value)}
                  placeholder="Specify other business goal"
                />
              </div>
            </div>

            {/* Marketing Objective */}
            <div className="space-y-2">
              <Label htmlFor="marketing_objective">Marketing Objective</Label>
              <Textarea
                id="marketing_objective"
                value={formData.section_1_campaign_strategy_objective.marketing_objective}
                onChange={(e) => updateSection('section_1_campaign_strategy_objective', 'marketing_objective', e.target.value)}
                placeholder="Describe your detailed marketing objectives"
                rows={3}
              />
            </div>

            {/* Primary KPI Target */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Primary KPI Target</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.section_1_campaign_strategy_objective.primary_kpi_target.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`kpi_${option}`}
                      checked={formData.section_1_campaign_strategy_objective.primary_kpi_target.selected.includes(option)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('section_1_campaign_strategy_objective', 'primary_kpi_target', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`kpi_${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kpi_other">Other KPI (specify)</Label>
                <Input
                  id="kpi_other"
                  value={formData.section_1_campaign_strategy_objective.primary_kpi_target.other_text}
                  onChange={(e) => updateNestedField('section_1_campaign_strategy_objective', 'primary_kpi_target', 'other_text', e.target.value)}
                  placeholder="Specify other KPI target"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Label htmlFor="cta">Call to Action</Label>
              <Select 
                value={formData.section_1_campaign_strategy_objective.cta.selected} 
                onValueChange={(value) => updateNestedField('section_1_campaign_strategy_objective', 'cta', 'selected', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CTA" />
                </SelectTrigger>
                <SelectContent>
                  {formData.section_1_campaign_strategy_objective.cta.options.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label htmlFor="cta_other">Custom CTA</Label>
                <Input
                  id="cta_other"
                  value={formData.section_1_campaign_strategy_objective.cta.other_text}
                  onChange={(e) => updateNestedField('section_1_campaign_strategy_objective', 'cta', 'other_text', e.target.value)}
                  placeholder="Specify custom CTA"
                />
              </div>
            </div>

            {/* Reason Now */}
            <div className="space-y-2">
              <Label htmlFor="reason_now">Reason Now</Label>
              <Textarea
                id="reason_now"
                value={formData.section_1_campaign_strategy_objective.reason_now}
                onChange={(e) => updateSection('section_1_campaign_strategy_objective', 'reason_now', e.target.value)}
                placeholder="Why is this campaign urgent or timely?"
                rows={3}
              />
            </div>

            {/* Differentiator */}
            <div className="space-y-2">
              <Label htmlFor="differentiator">Differentiator</Label>
              <Textarea
                id="differentiator"
                value={formData.section_2_audience_positioning.differentiator}
                onChange={(e) => updateSection('section_2_audience_positioning', 'differentiator', e.target.value)}
                placeholder="What makes your brand/product unique?"
                rows={3}
              />
            </div>

            {/* Offers/Promotions */}
            <div className="space-y-2">
              <Label>Offers/Promotions</Label>
              <div className="space-y-2">
                {formData.section_2_audience_positioning.offers_promotions?.map((offer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={offer}
                      onChange={(e) => {
                        const newOffers = [...(formData.section_2_audience_positioning.offers_promotions || [])];
                        newOffers[index] = e.target.value;
                        updateSection('section_2_audience_positioning', 'offers_promotions', newOffers);
                      }}
                      placeholder="Enter offer or promotion"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOffers = (formData.section_2_audience_positioning.offers_promotions || []).filter((_, i) => i !== index);
                        updateSection('section_2_audience_positioning', 'offers_promotions', newOffers);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new offer/promotion"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToList('section_2_audience_positioning', 'offers_promotions', newItem);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToList('section_2_audience_positioning', 'offers_promotions', newItem)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Audience Positioning */}
      {currentSection === 2 && (
        <div className="space-y-6">
          {/* Audience Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Add New Audience</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="target_demographics">Target Demographics</Label>
                <Textarea
                  id="target_demographics"
                  value={currentAudience.target_demographics}
                  onChange={(e) => setCurrentAudience(prev => ({ ...prev, target_demographics: e.target.value }))}
                  placeholder="Age, gender, income, education, location, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_psychographics">Target Psychographics</Label>
                <Textarea
                  id="target_psychographics"
                  value={currentAudience.target_psychographics}
                  onChange={(e) => setCurrentAudience(prev => ({ ...prev, target_psychographics: e.target.value }))}
                  placeholder="Interests, values, lifestyle, behaviors, attitudes"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="geo_allow">Geographic Allow List</Label>
                  <Textarea
                    id="geo_allow"
                    value={currentAudience.geo_allow}
                    onChange={(e) => setCurrentAudience(prev => ({ ...prev, geo_allow: e.target.value }))}
                    placeholder="Countries, regions, cities to target"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="geo_deny">Geographic Deny List</Label>
                  <Textarea
                    id="geo_deny"
                    value={currentAudience.geo_deny}
                    onChange={(e) => setCurrentAudience(prev => ({ ...prev, geo_deny: e.target.value }))}
                    placeholder="Countries, regions, cities to exclude"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familiarity_level">Familiarity Level</Label>
                <Select 
                  value={currentAudience.familiarity_level} 
                  onValueChange={(value) => setCurrentAudience(prev => ({ ...prev, familiarity_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select familiarity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totally-new">Totally New</SelectItem>
                    <SelectItem value="aware-not-engaged">Aware but Not Engaged</SelectItem>
                    <SelectItem value="familiar-user">Familiar User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key_takeaway">Key Takeaway *</Label>
                <Textarea
                  id="key_takeaway"
                  value={currentAudience.key_takeaway}
                  onChange={(e) => setCurrentAudience(prev => ({ ...prev, key_takeaway: e.target.value }))}
                  placeholder="What should the audience remember most?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={addAudience}
                  disabled={!currentAudience.key_takeaway.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Audience
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audience Cards */}
          {formData.section_2_audience_positioning.audiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Audiences ({formData.section_2_audience_positioning.audiences.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.section_2_audience_positioning.audiences.map((audience) => {
                  const demographics = audience.target_demographics.split(' ').slice(0, 2).join(' ');
                  const psychographics = audience.target_psychographics.split(' ').slice(0, 2).join(' ');
                  const title = `${demographics} - ${psychographics}`.replace(/^\s*-\s*|\s*-\s*$/g, '').trim() || 'Audience';
                  
                  return (
                    <Card key={audience.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAudience(audience.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        {audience.key_takeaway && (
                          <div>
                            <p className="text-xs text-gray-600 line-clamp-2">{audience.key_takeaway}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {audience.familiarity_level && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {audience.familiarity_level.replace('-', ' ')}
                            </Badge>
                          )}
                          {audience.geo_allow && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {audience.geo_allow.split(',')[0].trim()}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Creative & Tone */}
      {currentSection === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Creative & Tone</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Channels/Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {formData.section_3_creative_delivery_context.channels_platforms.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channels-${option}`}
                      checked={formData.section_3_creative_delivery_context.channels_platforms.selected.includes(option)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('section_3_creative_delivery_context', 'channels_platforms', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`channels-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Voiceover</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.section_3_creative_delivery_context.voiceover.required}
                  onCheckedChange={(checked) => updateNestedField('section_3_creative_delivery_context', 'voiceover', 'required', checked)}
                />
                <Label>Voiceover Required</Label>
              </div>
              {formData.section_3_creative_delivery_context.voiceover.required && (
                <Textarea
                  value={formData.section_3_creative_delivery_context.voiceover.style}
                  onChange={(e) => updateNestedField('section_3_creative_delivery_context', 'voiceover', 'style', e.target.value)}
                  placeholder="Describe voiceover style and requirements"
                  rows={2}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand_guidelines">Brand Guidelines</Label>
              <Textarea
                id="brand_guidelines"
                value={formData.section_3_creative_delivery_context.brand_guidelines}
                onChange={(e) => updateSection('section_3_creative_delivery_context', 'brand_guidelines', e.target.value)}
                placeholder="Any specific brand guidelines or requirements"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Winning Ads</Label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Upload winning ad files (videos, images)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="video/*,image/*"
                      className="hidden"
                      id="winning-ads-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('winning-ads-upload')?.click()}
                      className="mb-2"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="winning-ads-url">Or add URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="winning-ads-url"
                      placeholder="Enter winning ad URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reference Videos</Label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Video className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Upload reference video files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      className="hidden"
                      id="reference-videos-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('reference-videos-upload')?.click()}
                      className="mb-2"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Videos
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference-videos-url">Or add URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="reference-videos-url"
                      placeholder="Enter reference video URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Web Links/Documents</Label>
              <div className="space-y-2">
                {formData.section_3_creative_delivery_context.additional_links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...formData.section_3_creative_delivery_context.additional_links];
                        newLinks[index] = e.target.value;
                        updateSection('section_3_creative_delivery_context', 'additional_links', newLinks);
                      }}
                      placeholder="Enter web link or document URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLinks = formData.section_3_creative_delivery_context.additional_links.filter((_, i) => i !== index);
                        updateSection('section_3_creative_delivery_context', 'additional_links', newLinks);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add web link or document"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToList('section_3_creative_delivery_context', 'additional_links', newItem);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addToList('section_3_creative_delivery_context', 'additional_links', newItem)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Tone & Emotion</h3>
                </div>

                <div className="space-y-2">
                  <Label>Desired Feelings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.section_4_tone_emotion.desired_feelings.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feelings-${option}`}
                          checked={formData.section_4_tone_emotion.desired_feelings.selected.includes(option)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('section_4_tone_emotion', 'desired_feelings', option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`feelings-${option}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message_style">Message Style</Label>
                  <Select 
                    value={formData.section_4_tone_emotion.message_style} 
                    onValueChange={(value) => updateSection('section_4_tone_emotion', 'message_style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story-emotional">Story/Emotional</SelectItem>
                      <SelectItem value="direct-action">Direct/Action</SelectItem>
                      <SelectItem value="educational-informative">Educational/Informative</SelectItem>
                      <SelectItem value="warm-conversational">Warm/Conversational</SelectItem>
                      <SelectItem value="formal-polished">Formal/Polished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Brand Role</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {["Mentor", "Cheerleader", "Expert", "Friend", "Challenger"].map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`brand_role_${role.toLowerCase()}`}
                            name="brand_role"
                            value={role}
                            checked={formData.section_4_tone_emotion.brand_role === role}
                            onChange={(e) => updateSection('section_4_tone_emotion', 'brand_role', e.target.value)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`brand_role_${role.toLowerCase()}`} className="text-sm">{role}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand_role_custom">Custom Brand Role</Label>
                      <Input
                        id="brand_role_custom"
                        value={formData.section_4_tone_emotion.brand_role}
                        onChange={(e) => updateSection('section_4_tone_emotion', 'brand_role', e.target.value)}
                        placeholder="Describe your brand's role in this campaign"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_tone_overall">Brand Tone Overall</Label>
                  <Textarea
                    id="brand_tone_overall"
                    value={formData.section_4_tone_emotion.brand_tone_overall}
                    onChange={(e) => updateSection('section_4_tone_emotion', 'brand_tone_overall', e.target.value)}
                    placeholder="Describe the overall brand tone and personality"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creative_direction">Creative Direction</Label>
                  <Textarea
                    id="creative_direction"
                    value={formData.section_4_tone_emotion.creative_direction || ''}
                    onChange={(e) => updateSection('section_4_tone_emotion', 'creative_direction', e.target.value)}
                    placeholder="Describe the creative direction and visual style for this campaign"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 4: Personalization Inputs */}
      {currentSection === 4 && (
        <div className="space-y-6">
          {formData.section_2_audience_positioning.audiences.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personalization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Audiences Available</h3>
                  <p className="text-gray-500 mb-4">
                    Please create audiences in the "Audience Positioning" section first to enable personalization options.
                  </p>
                  <Button 
                    onClick={() => setCurrentSection(2)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Audience Positioning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Personalization Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Add Personalization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Audience Selection */}
                  <div className="space-y-2">
                    <Label>Select Audience *</Label>
                    <Select 
                      value={currentPersonalization.audience_id} 
                      onValueChange={(value) => setCurrentPersonalization(prev => ({ ...prev, audience_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.section_2_audience_positioning.audiences.map((audience) => {
                          const demographics = audience.target_demographics.split(' ').slice(0, 2).join(' ');
                          const psychographics = audience.target_psychographics.split(' ').slice(0, 2).join(' ');
                          const title = `${demographics} - ${psychographics}`.replace(/^\s*-\s*|\s*-\s*$/g, '').trim() || 'Audience';
                          return (
                            <SelectItem key={audience.id} value={audience.id}>{title}</SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Russian"].map((language) => (
                        <Badge
                          key={language}
                          variant={currentPersonalization.languages.includes(language) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => togglePersonalizationOption('languages', language)}
                        >
                          {language}
                          {currentPersonalization.languages.includes(language) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom language"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomOption('languages', customLanguage);
                            setCustomLanguage('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          addCustomOption('languages', customLanguage);
                          setCustomLanguage('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {currentPersonalization.languages.filter(lang => 
                      !["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Russian"].includes(lang)
                    ).map((language) => (
                      <Badge
                        key={language}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeCustomOption('languages', language)}
                      >
                        {language}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>

                  {/* Lengths */}
                  <div className="space-y-2">
                    <Label>Lengths</Label>
                    <div className="flex flex-wrap gap-2">
                      {["6s", "15s", "30s", "60s", "90s", "2min", "5min", "10min"].map((length) => (
                        <Badge
                          key={length}
                          variant={currentPersonalization.lengths.includes(length) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => togglePersonalizationOption('lengths', length)}
                        >
                          {length}
                          {currentPersonalization.lengths.includes(length) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom length (e.g., 45s, 3min)"
                        value={customLength}
                        onChange={(e) => setCustomLength(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomOption('lengths', customLength);
                            setCustomLength('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          addCustomOption('lengths', customLength);
                          setCustomLength('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {currentPersonalization.lengths.filter(length => 
                      !["6s", "15s", "30s", "60s", "90s", "2min", "5min", "10min"].includes(length)
                    ).map((length) => (
                      <Badge
                        key={length}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeCustomOption('lengths', length)}
                      >
                        {length}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>

                  {/* Ratios */}
                  <div className="space-y-2">
                    <Label>Ratios</Label>
                    <div className="flex flex-wrap gap-2">
                      {["16:9", "9:16", "1:1", "4:3", "3:4", "21:9", "9:21", "2:1", "1:2"].map((ratio) => (
                        <Badge
                          key={ratio}
                          variant={currentPersonalization.ratios.includes(ratio) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => togglePersonalizationOption('ratios', ratio)}
                        >
                          {ratio}
                          {currentPersonalization.ratios.includes(ratio) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom ratio (e.g., 3:2, 5:4)"
                        value={customRatio}
                        onChange={(e) => setCustomRatio(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomOption('ratios', customRatio);
                            setCustomRatio('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          addCustomOption('ratios', customRatio);
                          setCustomRatio('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {currentPersonalization.ratios.filter(ratio => 
                      !["16:9", "9:16", "1:1", "4:3", "3:4", "21:9", "9:21", "2:1", "1:2"].includes(ratio)
                    ).map((ratio) => (
                      <Badge
                        key={ratio}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeCustomOption('ratios', ratio)}
                      >
                        {ratio}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={addPersonalization}
                      disabled={!currentPersonalization.audience_id || 
                        (currentPersonalization.languages.length === 0 && currentPersonalization.lengths.length === 0 && currentPersonalization.ratios.length === 0)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Personalization
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Personalization Cards */}
              {formData.section_6_personalization_inputs.personalizations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personalizations ({formData.section_6_personalization_inputs.personalizations.length})</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.section_6_personalization_inputs.personalizations.map((personalization) => {
                      const audience = formData.section_2_audience_positioning.audiences.find(a => a.id === personalization.audience_id);
                      if (!audience) return null;
                      
                      const demographics = audience.target_demographics.split(' ').slice(0, 2).join(' ');
                      const psychographics = audience.target_psychographics.split(' ').slice(0, 2).join(' ');
                      const audienceTitle = `${demographics} - ${psychographics}`.replace(/^\s*-\s*|\s*-\s*$/g, '').trim() || 'Audience';
                      
                      const totalCombinations = Math.max(1, personalization.languages.length || 1) * 
                                             Math.max(1, personalization.lengths.length || 1) * 
                                             Math.max(1, personalization.ratios.length || 1);
                      
                      return (
                        <Card key={personalization.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{audienceTitle}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {totalCombinations} video{totalCombinations !== 1 ? 's' : ''}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePersonalization(personalization.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {personalization.languages.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-gray-600">Languages</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {personalization.languages.map((lang) => (
                                      <Badge key={lang} variant="outline" className="text-xs px-1 py-0">{lang}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {personalization.lengths.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-gray-600">Lengths</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {personalization.lengths.map((length) => (
                                      <Badge key={length} variant="outline" className="text-xs px-1 py-0">{length}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {personalization.ratios.length > 0 && (
                                <div>
                                  <Label className="text-xs font-medium text-gray-600">Ratios</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {personalization.ratios.map((ratio) => (
                                      <Badge key={ratio} variant="outline" className="text-xs px-1 py-0">{ratio}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Section 5: Brand Research */}
      {currentSection === 5 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Brand Research Inputs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Landing Page Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Landing Page Links</Label>
                  <Badge variant="outline" className="text-sm">
                    {formData.section_5_brand_research.landing_page_links.length} links
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {formData.section_5_brand_research.landing_page_links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.section_5_brand_research.landing_page_links];
                          newLinks[index] = { url: e.target.value };
                          updateSection('section_5_brand_research', 'landing_page_links', newLinks);
                        }}
                        placeholder="https://example.com"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newLinks = formData.section_5_brand_research.landing_page_links.filter((_, i) => i !== index);
                          updateSection('section_5_brand_research', 'landing_page_links', newLinks);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add landing page URL"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newItem.trim()) {
                          const newLinks = [...formData.section_5_brand_research.landing_page_links, { url: newItem.trim() }];
                          updateSection('section_5_brand_research', 'landing_page_links', newLinks);
                          setNewItem('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newItem.trim()) {
                          const newLinks = [...formData.section_5_brand_research.landing_page_links, { url: newItem.trim() }];
                          updateSection('section_5_brand_research', 'landing_page_links', newLinks);
                          setNewItem('');
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Social Media Links</Label>
                  <Badge variant="outline" className="text-sm">
                    {formData.section_5_brand_research.social_media_links.length} accounts
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {formData.section_5_brand_research.social_media_links.map((social, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Select
                        value={social.platform}
                        onValueChange={(value) => {
                          const newSocials = [...formData.section_5_brand_research.social_media_links];
                          newSocials[index] = { ...social, platform: value };
                          updateSection('section_5_brand_research', 'social_media_links', newSocials);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IG">Instagram</SelectItem>
                          <SelectItem value="FB">Facebook</SelectItem>
                          <SelectItem value="YT">YouTube</SelectItem>
                          <SelectItem value="X">Twitter/X</SelectItem>
                          <SelectItem value="TT">TikTok</SelectItem>
                          <SelectItem value="LI">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={social.handle_or_url}
                        onChange={(e) => {
                          const newSocials = [...formData.section_5_brand_research.social_media_links];
                          newSocials[index] = { ...social, handle_or_url: e.target.value };
                          updateSection('section_5_brand_research', 'social_media_links', newSocials);
                        }}
                        placeholder="@username or https://..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSocials = formData.section_5_brand_research.social_media_links.filter((_, i) => i !== index);
                          updateSection('section_5_brand_research', 'social_media_links', newSocials);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <Select
                      value=""
                      onValueChange={(platform) => {
                        if (platform) {
                          const newSocials = [...formData.section_5_brand_research.social_media_links, { platform, handle_or_url: '' }];
                          updateSection('section_5_brand_research', 'social_media_links', newSocials);
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Add Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IG">Instagram</SelectItem>
                        <SelectItem value="FB">Facebook</SelectItem>
                        <SelectItem value="YT">YouTube</SelectItem>
                        <SelectItem value="X">Twitter/X</SelectItem>
                        <SelectItem value="TT">TikTok</SelectItem>
                        <SelectItem value="LI">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newSocials = [...formData.section_5_brand_research.social_media_links, { platform: 'IG', handle_or_url: '' }];
                        updateSection('section_5_brand_research', 'social_media_links', newSocials);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">i</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Brand Research Process</h4>
                    <p className="text-sm text-blue-700">
                      The system will analyze your landing pages and social media accounts to extract brand insights, 
                      identify competitors, and generate creative strategy recommendations. This process typically takes 2-5 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
