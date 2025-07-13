// Media-Rich Proposal Generation Service
import { apiRequest } from '../lib/queryClient';

export interface MediaElement {
  type: 'image' | 'chart' | 'table' | 'scenario' | 'infographic' | 'video' | 'interactive' | 'timeline' | 'map' | 'document' | 'presentation' | 'dashboard' | '3d_model' | 'flowchart' | 'gantt';
  id: string;
  title: string;
  content: any;
  position: 'inline' | 'full-width' | 'sidebar';
  description?: string;
  isInteractive?: boolean;
  videoUrl?: string;
  mapData?: any;
  templateType?: 'professional' | 'modern' | 'academic' | 'creative';
  dataSource?: 'real' | 'intelligent' | 'computed';
}

export interface RichProposalSection {
  id: string;
  title: string;
  content: string;
  mediaElements: MediaElement[];
  wordLimit?: number;
  required: boolean;
  analysis?: any;
}

export class MediaProposalGenerator {
  
  // Generate image suggestions based on section content
  static generateImageSuggestions(sectionTitle: string, content: string, context: any): MediaElement[] {
    const suggestions: MediaElement[] = [];
    
    const imageSuggestions = {
      "Executive Summary": [
        {
          type: 'infographic' as const,
          id: `img_${Date.now()}_1`,
          title: 'Project Impact Overview',
          content: {
            template: 'impact_infographic',
            data: {
              beneficiaries: context.targetBeneficiaries || '50,000+',
              timeline: context.projectDuration || '18 months',
              sectors: context.sectors || ['Healthcare', 'Technology'],
              regions: context.regions || [context.country || 'Uganda']
            }
          },
          position: 'full-width' as const,
          description: 'Visual overview of project scope and expected impact'
        }
      ],
      "Problem Statement": [
        {
          type: 'chart' as const,
          id: `chart_${Date.now()}_1`,
          title: 'Problem Statistics',
          content: {
            type: 'bar',
            data: {
              labels: ['Current State', 'After Intervention'],
              datasets: [{
                label: 'Healthcare Access (%)',
                data: [35, 85],
                backgroundColor: ['#ef4444', '#10b981']
              }]
            }
          },
          position: 'inline' as const,
          description: 'Statistical representation of the problem and proposed solution impact'
        },
        {
          type: 'image' as const,
          id: `img_${Date.now()}_2`,
          title: 'Community Impact Visualization',
          content: {
            prompt: `Generate an image showing rural healthcare challenges in ${context.country || 'East Africa'}, depicting limited access to medical services and the need for digital health solutions`,
            style: 'documentary',
            dimensions: '16:9'
          },
          position: 'full-width' as const,
          description: 'Visual representation of the healthcare access challenges'
        }
      ],
      "Project Description": [
        {
          type: 'table' as const,
          id: `table_${Date.now()}_1`,
          title: 'Project Implementation Timeline',
          content: {
            headers: ['Phase', 'Activities', 'Duration', 'Milestones', 'Resources'],
            rows: [
              ['Phase 1: Setup', 'Team recruitment, infrastructure setup', '3 months', 'Team assembled, systems ready', '25% of budget'],
              ['Phase 2: Development', 'Platform development, testing', '6 months', 'Beta platform launched', '40% of budget'],
              ['Phase 3: Deployment', 'Rollout, training, monitoring', '6 months', 'Full deployment complete', '25% of budget'],
              ['Phase 4: Evaluation', 'Impact assessment, reporting', '3 months', 'Final report submitted', '10% of budget']
            ]
          },
          position: 'full-width' as const,
          description: 'Detailed project implementation timeline and resource allocation'
        },
        {
          type: 'scenario' as const,
          id: `scenario_${Date.now()}_1`,
          title: 'Success Story Scenario',
          content: {
            narrative: `Meet Sarah, a community health worker in rural ${context.country || 'Uganda'}. Before our intervention, Sarah had to walk 15km to report patient data to the nearest health facility. With our mobile health platform, Sarah now instantly uploads patient information, receives real-time guidance from doctors, and coordinates emergency responses. Result: 60% faster emergency response times and 300% increase in preventive care delivery.`,
            metrics: [
              { label: 'Response Time', before: '4-6 hours', after: '30 minutes', improvement: '85% faster' },
              { label: 'Data Accuracy', before: '65%', after: '95%', improvement: '46% increase' },
              { label: 'Patient Reach', before: '200/month', after: '800/month', improvement: '300% increase' }
            ]
          },
          position: 'full-width' as const,
          description: 'Real-world impact scenario demonstrating project effectiveness'
        }
      ],
      "Budget Justification": [
        {
          type: 'chart' as const,
          id: `chart_${Date.now()}_2`,
          title: 'Budget Allocation',
          content: {
            type: 'pie',
            data: {
              labels: ['Personnel (45%)', 'Technology (25%)', 'Training (15%)', 'Operations (10%)', 'Evaluation (5%)'],
              datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
              }]
            }
          },
          position: 'inline' as const,
          description: 'Visual breakdown of budget allocation across project components'
        },
        {
          type: 'table' as const,
          id: `table_${Date.now()}_2`,
          title: 'Detailed Budget Breakdown',
          content: {
            headers: ['Category', 'Item', 'Quantity', 'Unit Cost', 'Total', 'Justification'],
            rows: [
              ['Personnel', 'Project Manager', '1 FTE x 18 months', '$2,500/month', '$45,000', 'Experienced leader with health sector background'],
              ['Personnel', 'Software Developers', '3 FTE x 12 months', '$2,000/month', '$72,000', 'Mobile app and platform development'],
              ['Technology', 'Server Infrastructure', '18 months hosting', '$800/month', '$14,400', 'Scalable cloud infrastructure for 50K users'],
              ['Technology', 'Mobile Devices', '100 tablets', '$250/device', '$25,000', 'For community health workers'],
              ['Training', 'Capacity Building', '200 participants', '$150/person', '$30,000', 'Comprehensive digital literacy training']
            ]
          },
          position: 'full-width' as const,
          description: 'Comprehensive budget breakdown with detailed justifications'
        }
      ],
      "Organizational Capacity": [
        {
          type: 'infographic' as const,
          id: `img_${Date.now()}_3`,
          title: 'Team Expertise Visualization',
          content: {
            template: 'team_expertise',
            data: {
              teamSize: context.teamSize || 15,
              expertiseAreas: context.expertiseAreas || ['Digital Health', 'Community Outreach', 'Healthcare Innovation'],
              experience: context.experienceYears || 7,
              pastProjects: context.pastProjects || ['Mobile Health App', 'Telemedicine Platform']
            }
          },
          position: 'full-width' as const,
          description: 'Visual representation of organizational capacity and team expertise'
        },
        {
          type: 'video' as const,
          id: `video_${Date.now()}_1`,
          title: 'Project Impact Video',
          content: {
            videoUrl: 'https://example.com/project-impact.mp4',
            duration: '3:45',
            description: 'Professional video showcasing project outcomes and community impact'
          },
          position: 'full-width' as const,
          description: 'Video demonstration of organizational capacity and past project success'
        },
        {
          type: 'interactive' as const,
          id: `interactive_${Date.now()}_1`,
          title: 'Interactive Timeline',
          content: {
            timeline: [
              { year: '2018', event: 'Organization founded', milestone: 'Legal registration completed' },
              { year: '2019', event: 'First mobile health project', milestone: '5,000 patients reached' },
              { year: '2021', event: 'Telemedicine platform launch', milestone: '15,000 consultations' },
              { year: '2023', event: 'Community health worker training', milestone: '150 CHWs trained' },
              { year: '2025', event: 'Expansion project', milestone: 'Target: 50,000 beneficiaries' }
            ]
          },
          position: 'full-width' as const,
          isInteractive: true,
          description: 'Interactive timeline showing organizational growth and milestones'
        },
        {
          type: 'map' as const,
          id: `map_${Date.now()}_1`,
          title: 'Geographic Coverage Map',
          content: {
            regions: ['Central Uganda', 'Western Uganda', 'Northern Uganda'],
            facilities: 45,
            beneficiaries: 25000,
            coverage_area: '12,000 sq km'
          },
          position: 'full-width' as const,
          description: 'Interactive map showing project locations and coverage areas'
        }
      ]
    };

    return imageSuggestions[sectionTitle] || [];
  }

  // Generate media-rich content automatically
  static async generateRichContent(
    sectionTitle: string, 
    baseContent: string, 
    context: any
  ): Promise<{ content: string; mediaElements: MediaElement[] }> {
    
    // Generate media suggestions
    const mediaElements = this.generateImageSuggestions(sectionTitle, baseContent, context);
    
    // Enhance content with media references
    let enhancedContent = baseContent;
    
    // Insert media references into content
    mediaElements.forEach((media, index) => {
      const mediaReference = `\n\n[${media.type.toUpperCase()}: ${media.title}]\n${media.description || ''}\n`;
      
      // Insert at strategic points based on content length
      const insertPosition = Math.floor((enhancedContent.length / mediaElements.length) * (index + 1));
      enhancedContent = enhancedContent.slice(0, insertPosition) + mediaReference + enhancedContent.slice(insertPosition);
    });

    return {
      content: enhancedContent,
      mediaElements
    };
  }

  // Generate SVG charts and infographics
  static generateSVGChart(mediaElement: MediaElement): string {
    if (mediaElement.type === 'chart' && mediaElement.content.type === 'pie') {
      const data = mediaElement.content.data;
      return this.generatePieChart(data);
    } else if (mediaElement.type === 'chart' && mediaElement.content.type === 'bar') {
      const data = mediaElement.content.data;
      return this.generateBarChart(data);
    } else if (mediaElement.type === 'infographic') {
      return this.generateInfographic(mediaElement.content);
    }
    return '';
  }

  private static generatePieChart(data: any): string {
    const radius = 100;
    const centerX = 120;
    const centerY = 120;
    let currentAngle = 0;
    
    const paths = data.datasets[0].data.map((value: number, index: number) => {
      const angle = (value / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      currentAngle += angle;
      
      return `
        <path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
              fill="${data.datasets[0].backgroundColor[index]}" 
              stroke="white" 
              stroke-width="2"/>
      `;
    }).join('');

    const labels = data.labels.map((label: string, index: number) => {
      return `
        <div class="flex items-center mb-2">
          <div class="w-4 h-4 rounded mr-2" style="background-color: ${data.datasets[0].backgroundColor[index]}"></div>
          <span class="text-sm">${label}: ${data.datasets[0].data[index]}%</span>
        </div>
      `;
    }).join('');

    return `
      <div class="flex items-center justify-center space-x-8 p-6 bg-white rounded-lg shadow-sm border">
        <svg width="240" height="240" viewBox="0 0 240 240">
          ${paths}
        </svg>
        <div class="space-y-2">
          ${labels}
        </div>
      </div>
    `;
  }

  private static generateBarChart(data: any): string {
    const maxValue = Math.max(...data.datasets[0].data);
    const bars = data.labels.map((label: string, index: number) => {
      const height = (data.datasets[0].data[index] / maxValue) * 200;
      return `
        <div class="flex flex-col items-center">
          <div class="bg-blue-500 rounded-t" style="width: 60px; height: ${height}px"></div>
          <div class="text-sm mt-2 text-center font-medium">${data.datasets[0].data[index]}%</div>
          <div class="text-xs text-gray-600 text-center mt-1">${label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="p-6 bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold mb-4 text-center">${data.datasets[0].label}</h3>
        <div class="flex justify-center items-end space-x-8" style="height: 250px;">
          ${bars}
        </div>
      </div>
    `;
  }

  private static generateInfographic(content: any): string {
    if (content.template === 'impact_infographic') {
      return `
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 class="text-2xl font-bold text-center mb-6">Project Impact Overview</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold">${content.data.beneficiaries}</div>
              <div class="text-sm opacity-90">Beneficiaries</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold">${content.data.timeline}</div>
              <div class="text-sm opacity-90">Timeline</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold">${content.data.sectors.length}</div>
              <div class="text-sm opacity-90">Sectors</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold">${content.data.regions.length}</div>
              <div class="text-sm opacity-90">Regions</div>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }
}

export default MediaProposalGenerator;