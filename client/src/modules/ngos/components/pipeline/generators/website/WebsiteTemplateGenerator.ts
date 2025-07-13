/**
 * Granada OS - Website Template Generator with DeepSeek Integration
 * Generates complete website code using AI assistance
 */

interface WebsiteConfig {
  organizationName: string;
  tagline: string;
  description: string;
  sector: string;
  location: string;
  websiteType: string;
  primaryColor: string;
  secondaryColor: string;
  layoutStyle: string;
  fontStyle: string;
  sections: Record<string, { enabled: boolean; priority: number }>;
  features: Record<string, boolean>;
  generateContent: Record<string, boolean>;
}

interface GeneratedWebsite {
  type: string;
  pages: string[];
  features: string[];
  size: string;
  htmlPreview: string;
  reactCode: string;
  htmlCode: string;
  wordpressTheme: string;
  cssCode: string;
  jsCode: string;
  generatedAt: string;
}

export class WebsiteTemplateGenerator {
  private config: WebsiteConfig;
  private deepseekApiUrl = '/api/ai/generate-website-code';

  constructor(config: WebsiteConfig) {
    this.config = config;
  }

  async generateComplete(): Promise<GeneratedWebsite> {
    const enabledSections = Object.entries(this.config.sections)
      .filter(([_, section]) => section.enabled)
      .sort(([_, a], [__, b]) => a.priority - b.priority)
      .map(([key, _]) => key);

    const enabledFeatures = Object.entries(this.config.features)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key);

    // Generate content using DeepSeek AI
    const generatedContent = await this.generateContentWithAI();
    
    // Generate code based on website type
    let codeGeneration;
    switch (this.config.websiteType) {
      case 'react':
        codeGeneration = await this.generateReactWebsite(generatedContent);
        break;
      case 'wordpress':
        codeGeneration = await this.generateWordPressTheme(generatedContent);
        break;
      default:
        codeGeneration = await this.generateStaticWebsite(generatedContent);
    }

    return {
      type: this.config.websiteType,
      pages: enabledSections,
      features: enabledFeatures,
      size: '2.5 MB',
      htmlPreview: this.generateHTMLPreview(generatedContent),
      reactCode: codeGeneration.react || '',
      htmlCode: codeGeneration.html || '',
      wordpressTheme: codeGeneration.wordpress || '',
      cssCode: codeGeneration.css || '',
      jsCode: codeGeneration.js || '',
      generatedAt: new Date().toLocaleDateString()
    };
  }

  private async generateContentWithAI(): Promise<any> {
    try {
      const prompt = `Generate professional website content for an NGO with the following details:
      
Organization: ${this.config.organizationName}
Tagline: ${this.config.tagline}
Sector: ${this.config.sector}
Location: ${this.config.location}
Description: ${this.config.description}

Generate content for these sections: ${Object.entries(this.config.sections)
        .filter(([_, section]) => section.enabled)
        .map(([key, _]) => key)
        .join(', ')}

Please provide:
1. Compelling about page content
2. Project descriptions (3-4 projects)
3. Impact statistics
4. Call-to-action text
5. Contact information structure

Make it professional, engaging, and specific to the ${this.config.sector} sector.`;

      const response = await fetch(this.deepseekApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'content-generation',
          context: {
            organization: this.config.organizationName,
            sector: this.config.sector,
            websiteType: this.config.websiteType
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content with AI');
      }

      const data = await response.json();
      return this.parseGeneratedContent(data.content);
    } catch (error) {
      console.error('AI content generation failed, using fallback:', error);
      return this.getFallbackContent();
    }
  }

  private async generateReactWebsite(content: any): Promise<any> {
    try {
      const prompt = `Generate a complete React.js website for ${this.config.organizationName}. 

Requirements:
- Modern React 18 with TypeScript
- Responsive design using Tailwind CSS
- Primary color: ${this.config.primaryColor}
- Secondary color: ${this.config.secondaryColor}
- Layout style: ${this.config.layoutStyle}
- Font style: ${this.config.fontStyle}

Components needed:
- Header with navigation
- Hero section
- About section
- Projects showcase
- Donation section
- Contact form
- Footer

Features to include:
${Object.entries(this.config.features)
  .filter(([_, enabled]) => enabled)
  .map(([key, _]) => `- ${key}`)
  .join('\n')}

Generate the complete App.tsx, components, and CSS. Make it production-ready.`;

      const response = await fetch(this.deepseekApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'react-generation',
          context: {
            organization: this.config.organizationName,
            config: this.config,
            content
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { react: data.code };
      }
    } catch (error) {
      console.error('React generation failed:', error);
    }

    return { react: this.getFallbackReactCode(content) };
  }

  private async generateWordPressTheme(content: any): Promise<any> {
    try {
      const prompt = `Generate a complete WordPress theme for ${this.config.organizationName}.

Requirements:
- Modern WordPress theme structure
- Custom post types for projects
- Primary color: ${this.config.primaryColor}
- Secondary color: ${this.config.secondaryColor}
- Responsive design
- SEO optimized

Files needed:
- style.css
- index.php
- header.php
- footer.php
- functions.php
- single-project.php

Make it compatible with WordPress 6.0+ and include proper theme headers.`;

      const response = await fetch(this.deepseekApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'wordpress-generation',
          context: {
            organization: this.config.organizationName,
            config: this.config,
            content
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { wordpress: data.code };
      }
    } catch (error) {
      console.error('WordPress generation failed:', error);
    }

    return { wordpress: this.getFallbackWordPressCode(content) };
  }

  private async generateStaticWebsite(content: any): Promise<any> {
    try {
      const prompt = `Generate a complete static HTML website for ${this.config.organizationName}.

Requirements:
- Modern HTML5 structure
- CSS3 with flexbox/grid
- Vanilla JavaScript for interactions
- Fully responsive design
- Primary color: ${this.config.primaryColor}
- Secondary color: ${this.config.secondaryColor}
- Professional ${this.config.layoutStyle} layout

Include:
- Complete HTML structure
- Modern CSS with animations
- JavaScript for form handling and interactions
- SEO meta tags
- Accessibility features

Generate separate HTML, CSS, and JS files.`;

      const response = await fetch(this.deepseekApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'static-generation',
          context: {
            organization: this.config.organizationName,
            config: this.config,
            content
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          html: data.html,
          css: data.css,
          js: data.js
        };
      }
    } catch (error) {
      console.error('Static website generation failed:', error);
    }

    return this.getFallbackStaticCode(content);
  }

  private parseGeneratedContent(content: string): any {
    try {
      // Try to parse as JSON first
      return JSON.parse(content);
    } catch {
      // Parse manually from text
      return {
        about: this.extractSection(content, 'about'),
        projects: this.extractSection(content, 'projects'),
        impact: this.extractSection(content, 'impact'),
        callToAction: this.extractSection(content, 'call-to-action')
      };
    }
  }

  private extractSection(content: string, section: string): string {
    const patterns = {
      about: /(?:about|mission|story)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i,
      projects: /(?:projects|programs|initiatives)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i,
      impact: /(?:impact|statistics|achievements)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i,
      'call-to-action': /(?:donate|support|join|help)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i
    };

    const match = content.match(patterns[section as keyof typeof patterns]);
    return match ? match[0].trim() : '';
  }

  private getFallbackContent(): any {
    return {
      about: `${this.config.organizationName} is a dedicated ${this.config.sector} organization based in ${this.config.location}. ${this.config.description || 'We work tirelessly to make a positive impact in our community.'}`,
      projects: [
        {
          title: `${this.config.sector} Access Initiative`,
          description: `Improving ${this.config.sector} accessibility for underserved communities.`,
          impact: '500+ beneficiaries reached'
        },
        {
          title: 'Community Outreach Program',
          description: 'Building stronger connections within our target communities.',
          impact: '10 communities engaged'
        },
        {
          title: 'Capacity Building Project',
          description: 'Training local leaders and building sustainable solutions.',
          impact: '50+ leaders trained'
        }
      ],
      impact: {
        beneficiaries: '2,500+',
        communities: '15',
        projects: '25',
        years: '8'
      },
      callToAction: `Join us in making a difference. Your support helps ${this.config.organizationName} continue our vital work in ${this.config.sector}.`
    };
  }

  private getFallbackReactCode(content: any): string {
    return `
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="header" style={{ backgroundColor: '${this.config.primaryColor}' }}>
        <nav className="navbar">
          <div className="nav-brand">
            <h1>${this.config.organizationName}</h1>
          </div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#donate">Donate</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero" style={{ backgroundColor: '${this.config.secondaryColor}' }}>
          <div className="hero-content">
            <h2>${this.config.organizationName}</h2>
            <p>${this.config.tagline}</p>
            <button className="cta-button">Get Involved</button>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2>About Us</h2>
            <p>${content.about}</p>
          </div>
        </section>

        <section id="projects" className="projects">
          <div className="container">
            <h2>Our Projects</h2>
            <div className="projects-grid">
              ${content.projects.map((project: any, index: number) => `
                <div key={${index}} className="project-card">
                  <h3>${project.title}</h3>
                  <p>${project.description}</p>
                  <div className="impact">${project.impact}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section id="donate" className="donate" style={{ backgroundColor: '${this.config.primaryColor}' }}>
          <div className="container">
            <h2>Support Our Work</h2>
            <p>${content.callToAction}</p>
            <button className="donate-button">Donate Now</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 ${this.config.organizationName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;`;
  }

  private getFallbackWordPressCode(content: any): string {
    return `<?php
/*
Theme Name: ${this.config.organizationName} Theme
Description: Custom WordPress theme for ${this.config.organizationName}
Version: 1.0
*/

// functions.php content
function theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    
    register_nav_menus(array(
        'primary' => 'Primary Menu',
    ));
}
add_action('after_setup_theme', 'theme_setup');

// index.php content
get_header(); ?>

<main class="main-content">
    <section class="hero" style="background-color: ${this.config.primaryColor};">
        <div class="container">
            <h1><?php bloginfo('name'); ?></h1>
            <p><?php bloginfo('description'); ?></p>
        </div>
    </section>
    
    <section class="content">
        <div class="container">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <article>
                    <h2><?php the_title(); ?></h2>
                    <div><?php the_content(); ?></div>
                </article>
            <?php endwhile; endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>`;
  }

  private getFallbackStaticCode(content: any): any {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.config.organizationName}</title>
    <meta name="description" content="${this.config.description}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${this.config.organizationName}</h1>
            </div>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#donate">Donate</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h2>${this.config.organizationName}</h2>
                <p>${this.config.tagline}</p>
                <button class="cta-button" onclick="scrollToSection('donate')">Get Involved</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>${content.about}</p>
            </div>
        </section>

        <section id="projects" class="projects">
            <div class="container">
                <h2>Our Projects</h2>
                <div class="projects-grid">
                    ${content.projects.map((project: any) => `
                    <div class="project-card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="impact">${project.impact}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section id="donate" class="donate">
            <div class="container">
                <h2>Support Our Work</h2>
                <p>${content.callToAction}</p>
                <button class="donate-button">Donate Now</button>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${this.config.organizationName}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    const css = `
:root {
    --primary-color: ${this.config.primaryColor};
    --secondary-color: ${this.config.secondaryColor};
    --text-color: #333;
    --bg-color: #fff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 150px 0 100px;
    text-align: center;
    margin-top: 80px;
}

.hero h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button, .donate-button {
    background: white;
    color: var(--primary-color);
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover, .donate-button:hover {
    transform: translateY(-2px);
}

.about, .projects {
    padding: 80px 0;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.project-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
}

.donate {
    background: var(--secondary-color);
    color: white;
    padding: 80px 0;
    text-align: center;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
}`;

    const js = `
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(59, 130, 246, 0.95)';
    } else {
        header.style.background = 'var(--primary-color)';
    }
});`;

    return { html, css, js };
  }

  generateHTMLPreview(content: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.config.organizationName} - Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: ${this.config.primaryColor}; color: white; padding: 1rem; text-align: center; }
        .hero { background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.secondaryColor}); color: white; padding: 60px 20px; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .project-card { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .donate { background: ${this.config.secondaryColor}; color: white; padding: 40px 20px; text-align: center; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; }
        .btn { background: white; color: ${this.config.primaryColor}; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${this.config.organizationName}</h1>
        <p>${this.config.tagline}</p>
    </header>
    
    <section class="hero">
        <h2>Making a Difference in ${this.config.sector}</h2>
        <p>Based in ${this.config.location}</p>
        <button class="btn">Get Involved</button>
    </section>
    
    <div class="container">
        <h2>About Us</h2>
        <p>${content.about}</p>
        
        <h2>Our Projects</h2>
        <div class="projects">
            ${content.projects.map((project: any) => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <strong>${project.impact}</strong>
            </div>
            `).join('')}
        </div>
    </div>
    
    <section class="donate">
        <h2>Support Our Mission</h2>
        <p>${content.callToAction}</p>
        <button class="btn">Donate Now</button>
    </section>
    
    <footer class="footer">
        <p>&copy; 2024 ${this.config.organizationName}. All rights reserved.</p>
    </footer>
</body>
</html>`;
  }
}