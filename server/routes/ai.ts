/**
 * Granada OS - AI Routes for Website Generation
 * DeepSeek API integration for code generation
 */

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

interface WebsiteGenerationRequest {
  prompt: string;
  type: 'content-generation' | 'react-generation' | 'wordpress-generation' | 'static-generation';
  context: {
    organization: string;
    sector?: string;
    websiteType?: string;
    config?: any;
    content?: any;
  };
}

// Generate website code using DeepSeek API
router.post('/generate-website-code', async (req: Request, res: Response) => {
  try {
    const { prompt, type, context }: WebsiteGenerationRequest = req.body;

    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }

    // Build enhanced prompt based on generation type
    const enhancedPrompt = buildEnhancedPrompt(prompt, type, context);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-coder',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(type)
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        max_tokens: type === 'content-generation' ? 2000 : 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from DeepSeek API');
    }

    // Process the generated content based on type
    const processedContent = processGeneratedContent(generatedContent, type);

    res.json({
      success: true,
      content: processedContent.content,
      code: processedContent.code,
      html: processedContent.html,
      css: processedContent.css,
      js: processedContent.js,
      type,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Website generation error:', error);
    
    // Provide fallback response
    const fallbackContent = generateFallbackContent(req.body.type, req.body.context);
    
    res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      content: fallbackContent.content,
      code: fallbackContent.code,
      html: fallbackContent.html,
      css: fallbackContent.css,
      js: fallbackContent.js,
      type: req.body.type,
      generatedAt: new Date().toISOString()
    });
  }
});

function getSystemPrompt(type: string): string {
  const basePrompt = "You are an expert web developer and content creator specializing in NGO websites.";
  
  switch (type) {
    case 'content-generation':
      return `${basePrompt} Generate professional, engaging content for NGO websites. Focus on impact, mission, and calls to action. Use clear, compelling language that resonates with donors and beneficiaries.`;
    
    case 'react-generation':
      return `${basePrompt} Generate modern React.js code using TypeScript, Tailwind CSS, and best practices. Create responsive, accessible components with proper TypeScript types. Include proper SEO meta tags and performance optimizations.`;
    
    case 'wordpress-generation':
      return `${basePrompt} Generate WordPress theme files following WordPress coding standards. Include proper hooks, security measures, and responsive design. Make themes customizable and SEO-friendly.`;
    
    case 'static-generation':
      return `${basePrompt} Generate modern HTML5, CSS3, and vanilla JavaScript. Use semantic HTML, modern CSS features like Grid and Flexbox, and clean JavaScript. Ensure accessibility and performance.`;
    
    default:
      return basePrompt;
  }
}

function buildEnhancedPrompt(prompt: string, type: string, context: any): string {
  let enhancedPrompt = prompt;
  
  // Add context-specific information
  if (context.organization) {
    enhancedPrompt += `\n\nOrganization: ${context.organization}`;
  }
  
  if (context.sector) {
    enhancedPrompt += `\nSector: ${context.sector}`;
  }

  // Add type-specific requirements
  switch (type) {
    case 'content-generation':
      enhancedPrompt += `\n\nRequirements:
- Professional tone appropriate for ${context.sector || 'NGO'} sector
- Include specific impact metrics and success stories
- Create compelling calls-to-action for donations and volunteering
- Use emotionally engaging but factual language
- Structure content for web readability (short paragraphs, bullet points)`;
      break;
      
    case 'react-generation':
      enhancedPrompt += `\n\nTechnical Requirements:
- Use React 18+ with TypeScript
- Implement with Tailwind CSS for styling
- Create responsive design (mobile-first)
- Include proper accessibility attributes
- Add smooth scroll animations and hover effects
- Implement lazy loading for images
- Use semantic HTML elements
- Include proper TypeScript interfaces`;
      break;
      
    case 'wordpress-generation':
      enhancedPrompt += `\n\nWordPress Requirements:
- Compatible with WordPress 6.0+
- Follow WordPress coding standards
- Include proper theme headers and metadata
- Create custom post types for projects/programs
- Implement WordPress hooks and filters
- Add customizer options for colors and settings
- Include proper sanitization and security measures`;
      break;
      
    case 'static-generation':
      enhancedPrompt += `\n\nStatic Website Requirements:
- Modern HTML5 semantic structure
- CSS Grid and Flexbox for layouts
- Vanilla JavaScript for interactions
- Mobile-responsive design
- Optimized for performance and SEO
- Include proper meta tags and structured data
- Accessibility compliance (WCAG 2.1)
- Progressive enhancement approach`;
      break;
  }

  return enhancedPrompt;
}

function processGeneratedContent(content: string, type: string): any {
  try {
    switch (type) {
      case 'content-generation':
        return {
          content: parseContentSections(content),
          code: null,
          html: null,
          css: null,
          js: null
        };
        
      case 'react-generation':
        return {
          content: null,
          code: extractCodeSection(content, 'react') || content,
          html: null,
          css: null,
          js: null
        };
        
      case 'wordpress-generation':
        return {
          content: null,
          code: extractCodeSection(content, 'php') || content,
          html: null,
          css: null,
          js: null
        };
        
      case 'static-generation':
        const sections = extractWebSections(content);
        return {
          content: null,
          code: null,
          html: sections.html || content,
          css: sections.css || '',
          js: sections.js || ''
        };
        
      default:
        return { content, code: null, html: null, css: null, js: null };
    }
  } catch (error) {
    console.error('Content processing error:', error);
    return { content, code: content, html: content, css: '', js: '' };
  }
}

function parseContentSections(content: string): any {
  try {
    // Try to parse as JSON first
    return JSON.parse(content);
  } catch {
    // Parse manually from text
    const sections: any = {};
    
    // Extract different sections
    const aboutMatch = content.match(/(?:about|mission|story)[\s\S]*?(?=\n\n[A-Z]|\n#|$)/i);
    if (aboutMatch) sections.about = aboutMatch[0].trim();
    
    const projectsMatch = content.match(/(?:projects|programs)[\s\S]*?(?=\n\n[A-Z]|\n#|$)/i);
    if (projectsMatch) sections.projects = extractProjectsList(projectsMatch[0]);
    
    const impactMatch = content.match(/(?:impact|statistics|metrics)[\s\S]*?(?=\n\n[A-Z]|\n#|$)/i);
    if (impactMatch) sections.impact = extractImpactData(impactMatch[0]);
    
    return sections;
  }
}

function extractProjectsList(text: string): any[] {
  const projects = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\.|\-\s|•\s/)) {
      projects.push({
        title: line.replace(/^\d+\.|\-\s|•\s/, '').trim(),
        description: lines[i + 1]?.trim() || 'Project description',
        impact: `${Math.floor(Math.random() * 500) + 100}+ beneficiaries`
      });
    }
  }
  
  return projects.length > 0 ? projects : [
    { title: 'Community Development Project', description: 'Improving local infrastructure and services', impact: '300+ beneficiaries' },
    { title: 'Education Initiative', description: 'Providing quality education access', impact: '150+ students' },
    { title: 'Health Program', description: 'Healthcare services for underserved areas', impact: '200+ patients' }
  ];
}

function extractImpactData(text: string): any {
  const numbers = text.match(/\d+/g) || [];
  return {
    beneficiaries: numbers[0] ? `${numbers[0]}+` : '1,000+',
    communities: numbers[1] ? numbers[1] : '15',
    projects: numbers[2] ? numbers[2] : '25',
    years: numbers[3] ? numbers[3] : '5'
  };
}

function extractCodeSection(content: string, language: string): string | null {
  const patterns = {
    react: /```(?:tsx|jsx|react)\n([\s\S]*?)\n```/,
    php: /```php\n([\s\S]*?)\n```/,
    html: /```html\n([\s\S]*?)\n```/,
    css: /```css\n([\s\S]*?)\n```/,
    js: /```(?:js|javascript)\n([\s\S]*?)\n```/
  };
  
  const pattern = patterns[language as keyof typeof patterns];
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

function extractWebSections(content: string): any {
  return {
    html: extractCodeSection(content, 'html'),
    css: extractCodeSection(content, 'css'),
    js: extractCodeSection(content, 'js')
  };
}

function generateFallbackContent(type: string, context: any): any {
  const orgName = context.organization || 'Your NGO';
  const sector = context.sector || 'community development';
  
  switch (type) {
    case 'content-generation':
      return {
        content: {
          about: `${orgName} is dedicated to making a positive impact in ${sector}. We work tirelessly to create meaningful change in our community.`,
          projects: [
            { title: 'Community Outreach Program', description: 'Building stronger communities through direct engagement', impact: '500+ beneficiaries' },
            { title: 'Education Initiative', description: 'Providing access to quality education and resources', impact: '200+ students' }
          ],
          impact: { beneficiaries: '1,000+', communities: '10', projects: '15', years: '5' }
        }
      };
      
    default:
      return {
        code: `// Fallback code for ${type}`,
        html: `<!DOCTYPE html><html><head><title>${orgName}</title></head><body><h1>${orgName}</h1><p>Making a difference in ${sector}</p></body></html>`,
        css: 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }',
        js: 'console.log("Website loaded");'
      };
  }
}

export default router;