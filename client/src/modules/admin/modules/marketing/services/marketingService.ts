interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'content' | 'paid';
  status: 'draft' | 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  platform?: string;
  content?: string;
  subject?: string;
  cta?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: string;
  isActive: boolean;
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  mediaUrls: string[];
  scheduledTime?: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
}

interface MarketingMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalReach: number;
  avgEngagement: number;
  totalConversions: number;
  totalBudget: number;
  totalSpent: number;
  roi: number;
  emailOpenRate: number;
  emailClickRate: number;
  socialEngagementRate: number;
  websiteTraffic: number;
}

interface LeadSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    userType?: string[];
    location?: string[];
    activityLevel?: string;
    registrationDate?: {
      from: string;
      to: string;
    };
    engagement?: string;
  };
  userCount: number;
}

class MarketingService {
  private baseUrl = '/api/marketing';

  // Campaign Management
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/campaigns/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  // Email Marketing
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/email/templates`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/email/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  }

  async sendEmailCampaign(data: {
    templateId: string;
    segmentId: string;
    subject: string;
    variables: Record<string, string>;
    scheduleTime?: string;
  }): Promise<{ campaignId: string; estimatedRecipients: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending email campaign:', error);
      throw error;
    }
  }

  // Social Media Marketing
  async getSocialPosts(): Promise<SocialPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/social/posts`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching social posts:', error);
      throw error;
    }
  }

  async createSocialPost(post: Omit<SocialPost, 'id'>): Promise<SocialPost> {
    try {
      const response = await fetch(`${this.baseUrl}/social/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating social post:', error);
      throw error;
    }
  }

  async scheduleSocialPost(postId: string, scheduleTime: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/social/posts/${postId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduleTime }),
      });
    } catch (error) {
      console.error('Error scheduling social post:', error);
      throw error;
    }
  }

  // Analytics and Metrics
  async getMarketingMetrics(timeframe: string = '30d'): Promise<MarketingMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics?timeframe=${timeframe}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  }

  async getCampaignAnalytics(campaignId: string): Promise<{
    impressions: number[];
    clicks: number[];
    conversions: number[];
    dates: string[];
    demographics: Record<string, number>;
    topPerformingContent: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/analytics`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  }

  // Lead Segmentation
  async getLeadSegments(): Promise<LeadSegment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/segments`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching lead segments:', error);
      throw error;
    }
  }

  async createLeadSegment(segment: Omit<LeadSegment, 'id' | 'userCount'>): Promise<LeadSegment> {
    try {
      const response = await fetch(`${this.baseUrl}/segments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segment),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating lead segment:', error);
      throw error;
    }
  }

  // A/B Testing
  async createABTest(data: {
    campaignId: string;
    testType: 'subject' | 'content' | 'cta' | 'timing';
    variantA: Record<string, any>;
    variantB: Record<string, any>;
    trafficSplit: number; // percentage for variant A (B gets the rest)
    duration: number; // hours
  }): Promise<{ testId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/ab-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }

  // Content Generation
  async generateMarketingContent(data: {
    type: 'email' | 'social' | 'blog' | 'ad';
    targetAudience: string;
    tone: 'professional' | 'casual' | 'urgent' | 'friendly';
    objective: string;
    keyPoints: string[];
    platform?: string;
  }): Promise<{
    subject?: string;
    content: string;
    cta: string;
    hashtags?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating marketing content:', error);
      throw error;
    }
  }

  // Performance Optimization
  async getOptimizationSuggestions(campaignId: string): Promise<{
    improvements: Array<{
      type: string;
      suggestion: string;
      expectedImpact: string;
      implementation: string;
    }>;
    benchmarks: Record<string, number>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/optimize`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching optimization suggestions:', error);
      throw error;
    }
  }

  // Export and Reporting
  async exportCampaignReport(campaignId: string, format: 'pdf' | 'csv' | 'xlsx'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/export?format=${format}`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting campaign report:', error);
      throw error;
    }
  }

  async exportMetricsReport(timeframe: string, format: 'pdf' | 'csv' | 'xlsx'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics/export?timeframe=${timeframe}&format=${format}`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting metrics report:', error);
      throw error;
    }
  }
}

export const marketingService = new MarketingService();
export type { Campaign, EmailTemplate, SocialPost, MarketingMetrics, LeadSegment };