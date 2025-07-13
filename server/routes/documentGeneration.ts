import { Router } from 'express';

const router = Router();

// Document generation endpoint using DeepSeek API
router.post('/api/ai/generate-document-section', async (req, res) => {
  try {
    const {
      documentType,
      sectionTitle,
      sectionId,
      organizationContext,
      documentSettings,
      existingSections
    } = req.body;

    // Check if DeepSeek API key is available
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({
        error: 'System configuration error',
        message: 'Document generation service not configured'
      });
    }

    // Build the system prompt based on document type and section
    const systemPrompt = buildSystemPrompt(
      documentType,
      sectionTitle,
      sectionId,
      organizationContext,
      documentSettings
    );

    // Build user prompt with context
    const userPrompt = buildUserPrompt(
      documentType,
      sectionTitle,
      sectionId,
      organizationContext,
      existingSections
    );

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Clean and format the content
    const cleanedContent = cleanGeneratedContent(generatedContent);

    res.json({
      success: true,
      content: cleanedContent,
      wordCount: cleanedContent.split(' ').length,
      sectionId,
      sectionTitle
    });

  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: 'Unable to generate document section at this time'
    });
  }
});

function buildSystemPrompt(
  documentType: string,
  sectionTitle: string,
  sectionId: string,
  organizationContext: any,
  documentSettings: any
): string {
  const basePrompt = `You are an expert NGO policy and document writer with deep knowledge of international standards, compliance requirements, and best practices. You specialize in creating professional, comprehensive, and legally sound organizational documents.

Organization Context:
- Name: ${organizationContext.name}
- Type: ${organizationContext.type}
- Sector: ${organizationContext.sector}
- Country: ${organizationContext.country}
- Size: ${organizationContext.size}
- Focus: ${organizationContext.focus}

Document Requirements:
- Type: ${documentType}
- Section: ${sectionTitle}
- Tone: ${documentSettings.tone}
- Complexity: ${documentSettings.complexity}
- Include Examples: ${documentSettings.includeExamples}
- Include Procedures: ${documentSettings.includeProcedures}
- Compliance Level: ${documentSettings.complianceLevel}

Writing Guidelines:
1. Write in professional, clear language appropriate for NGO documentation
2. Include specific procedures, responsibilities, and implementation steps
3. Reference relevant international standards and frameworks where applicable
4. Ensure content is actionable and practical for implementation
5. Include compliance considerations for the organization's jurisdiction
6. Use appropriate formatting with headers, bullet points, and numbered lists
7. Provide concrete examples when requested
8. Ensure content aligns with the organization's context and sector
9. Write 300-800 words depending on section complexity
10. Do not include placeholder text or incomplete information`;

  // Add specific guidance based on document type
  if (documentType.toLowerCase().includes('child protection')) {
    return basePrompt + `

Special Focus for Child Protection Policy:
- Emphasize zero tolerance approach
- Include clear definitions of child abuse and exploitation
- Reference UN Convention on Rights of the Child
- Include mandatory reporting procedures
- Address both prevention and response measures
- Consider cultural context while maintaining international standards
- Include specific guidance for field operations and community interactions`;
  }

  if (documentType.toLowerCase().includes('financial')) {
    return basePrompt + `

Special Focus for Financial Policy:
- Include internal controls and segregation of duties
- Reference donor compliance requirements
- Address audit and transparency requirements
- Include approval hierarchies and spending limits
- Address foreign exchange and multi-currency considerations
- Include anti-fraud and corruption measures
- Reference relevant accounting standards and regulations`;
  }

  if (documentType.toLowerCase().includes('code of conduct')) {
    return basePrompt + `

Special Focus for Code of Conduct:
- Address professional behavior and ethical standards
- Include conflict of interest provisions
- Address confidentiality and information security
- Include social media and external communication guidelines
- Address gift and hospitality policies
- Include whistleblower protection measures
- Address relationships with beneficiaries and stakeholders`;
  }

  return basePrompt;
}

function buildUserPrompt(
  documentType: string,
  sectionTitle: string,
  sectionId: string,
  organizationContext: any,
  existingSections: any[]
): string {
  let prompt = `Please write the "${sectionTitle}" section for a ${documentType} for ${organizationContext.name}.`;

  if (existingSections && existingSections.length > 0) {
    prompt += `\n\nFor context, here are the existing sections already written:\n`;
    existingSections.forEach(section => {
      prompt += `\n${section.title}:\n${section.content.substring(0, 200)}...\n`;
    });
    prompt += `\nEnsure this new section builds upon and complements the existing content without repetition.`;
  }

  prompt += `\n\nThe section should be comprehensive, professional, and immediately implementable. Include specific procedures, responsibilities, and compliance considerations relevant to ${organizationContext.sector} organizations operating in ${organizationContext.country}.`;

  return prompt;
}

function cleanGeneratedContent(content: string): string {
  // Remove any markdown formatting that might interfere
  let cleaned = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  // Ensure proper paragraph spacing
  cleaned = cleaned.replace(/\n\n/g, '\n\n');
  
  return cleaned;
}

export default router;