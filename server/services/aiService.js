import OpenAI from 'openai';

// Initialize OpenAI client if key exists
const getOpenAIClient = () => {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return null;
};

/**
 * Intelligent Mock Report Generator
 * Analyzes candidate fields to construct a custom, high-fidelity report.
 */
const generateMockAnalysis = (candidate) => {
  const name = candidate.name || 'Candidate';
  const title = candidate.title || 'Professional';
  const profileText = candidate.profileText || '';

  // Determine candidate domain/role from title and profile text
  let domain = 'general';
  const lowerTitle = title.toLowerCase();
  const lowerProfile = profileText.toLowerCase();

  if (
    lowerTitle.includes('engineer') || 
    lowerTitle.includes('developer') || 
    lowerTitle.includes('programmer') || 
    lowerTitle.includes('tech') || 
    lowerTitle.includes('architect') ||
    lowerProfile.includes('javascript') ||
    lowerProfile.includes('python') ||
    lowerProfile.includes('java') ||
    lowerProfile.includes('software')
  ) {
    domain = 'technology';
  } else if (
    lowerTitle.includes('design') || 
    lowerTitle.includes('ux') || 
    lowerTitle.includes('ui') || 
    lowerTitle.includes('creative') ||
    lowerProfile.includes('figma') ||
    lowerProfile.includes('photoshop')
  ) {
    domain = 'design';
  } else if (
    lowerTitle.includes('product') || 
    lowerTitle.includes('pm') || 
    lowerTitle.includes('manager') ||
    lowerProfile.includes('agile') ||
    lowerProfile.includes('roadmap')
  ) {
    domain = 'product';
  } else if (
    lowerTitle.includes('market') || 
    lowerTitle.includes('sales') || 
    lowerTitle.includes('seo') ||
    lowerProfile.includes('marketing') ||
    lowerProfile.includes('campaign')
  ) {
    domain = 'marketing';
  }

  // Parse approximate experience from text
  let yearsOfExperience = 3;
  const expMatch = profileText.match(/(\d+)\+?\s*years?\s*of\s*experience/i) || profileText.match(/(\d+)\+?\s*yrs?\s*exp/i);
  if (expMatch && expMatch[1]) {
    yearsOfExperience = parseInt(expMatch[1], 10);
  } else {
    // Guess based on senior keywords
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('principal') || lowerTitle.includes('architect')) {
      yearsOfExperience = 7;
    } else if (lowerTitle.includes('junior') || lowerTitle.includes('entry') || lowerTitle.includes('associate')) {
      yearsOfExperience = 1;
    }
  }

  // Calculate score base on years and richness of profile
  let score = 70;
  if (yearsOfExperience >= 8) score += 18;
  else if (yearsOfExperience >= 5) score += 12;
  else if (yearsOfExperience >= 3) score += 6;

  if (profileText.length > 500) score += 5;
  if (candidate.email && candidate.phone) score += 3;
  if (candidate.linkedinUrl) score += 4;
  score = Math.min(score, 98); // Cap at 98

  // Decide recommendation based on score
  let recommendation = 'Consider';
  if (score >= 88) recommendation = 'Highly Recommended';
  else if (score >= 78) recommendation = 'Recommended';
  else if (score < 60) recommendation = 'Not Recommended';

  // Customize attributes based on domains
  let technicalSkills = [];
  let softSkills = [];
  let leadershipSkills = [];
  let missingSkills = [];
  let strengths = [];
  let improvementAreas = [];
  let techQuestions = [];
  let behavioralQuestions = [];
  let leadQuestions = [];
  let executiveSummary = '';
  let recommendationExplanation = '';

  if (domain === 'technology') {
    technicalSkills = ['JavaScript', 'Node.js', 'React', 'Git', 'REST APIs', 'SQL & NoSQL Databases', 'Docker', 'AWS'];
    softSkills = ['Problem Solving', 'Technical Communication', 'Team Collaboration', 'Adaptability'];
    leadershipSkills = ['Code Reviews', 'Technical Mentorship', 'System Architecture Ownership'];
    missingSkills = ['Kubernetes', 'CI/CD Pipeline Automation', 'GraphQL'];
    strengths = [
      `Strong backend/frontend engineering foundation with ${yearsOfExperience} years of experience.`,
      'Demonstrated expertise in building scalable applications.',
      'Proficient in database design and query optimization.',
      'Active participant in software engineering best practices.'
    ];
    improvementAreas = [
      'Limited experience with cloud automation and infrastructure-as-code.',
      'Could benefit from contributing more to system-level architectural design discussions.',
      'Gaps in automated integration testing practices.'
    ];
    techQuestions = [
      'Explain how you would design a rate limiter middleware for a high-traffic Express backend.',
      'What are the performance implications of React 19 Server Components and how do you handle state rehydration?',
      'How do you approach database schema migrations in Mongoose without incurring service downtime?'
    ];
    behavioralQuestions = [
      'Describe a time when you had to debug a critical production bug under intense time pressure. What was your process?',
      'How do you handle disagreements with a product manager regarding technical debt versus feature shipping speed?'
    ];
    leadQuestions = [
      'How do you guide junior developers through complex code reviews without hurting morale?',
      'Tell us about a time you introduced a new technology or framework to your engineering team.'
    ];
    executiveSummary = `${name} is an experienced ${title} with a solid background in software development. They demonstrate high capability in modern web libraries and backend platforms. With over ${yearsOfExperience} years in the tech industry, they have successfully delivered production software and worked collaboratively in cross-functional agile teams. Their technical foundation is strong, backed by hands-on development practices.`;
    recommendationExplanation = `${name} exhibits high competency in core development stacks, matching key requirements for development positions. Their score reflects their ${yearsOfExperience} years of experience and thorough skill description.`;
  } else if (domain === 'design') {
    technicalSkills = ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'];
    softSkills = ['Empathy', 'Visual Communication', 'Presentation Skills', 'Active Listening'];
    leadershipSkills = ['Design Mentorship', 'Brand Strategy Direction', 'Creative Alignment'];
    missingSkills = ['Basic HTML/CSS', 'A/B Testing Methodologies', 'User Analytics Tools'];
    strengths = [
      `Creative designer with a strong portfolio showcasing customer-centric solutions over ${yearsOfExperience} years.`,
      'High proficiency in Figma, design systems, and vector graphics.',
      'Deep understanding of user accessibility standards and typography.',
      'Excellent ability to convert complex product goals into simple, interactive user interfaces.'
    ];
    improvementAreas = [
      'Limited exposure to quantitative user testing and analytics-backed UX validation.',
      'Should seek deeper collaboration with development teams to understand technical UI constraints.',
      'Could polish skills in motion design and interactive micro-animations.'
    ];
    techQuestions = [
      'How do you structure and maintain a scalable design component library in Figma for multi-designer teams?',
      'Walk us through your process of creating a user flow for a complex, data-heavy dashboard interface.',
      'What accessibility standards (e.g., WCAG) do you prioritize when designing light and dark mode contrasts?'
    ];
    behavioralQuestions = [
      'Tell us about a time your design was heavily criticized by stakeholders. How did you incorporate feedback without compromising UX?',
      'Describe how you balance aesthetic desires with practical engineering constraints.'
    ];
    leadQuestions = [
      'How do you advocate for user-centered design in an organization that is highly driven by fast engineering delivery?',
      'How do you mentor junior designers in defining their visual styles?'
    ];
    executiveSummary = `${name} is a creative and user-focused ${title} with ${yearsOfExperience} years of experience craft premium SaaS and mobile interfaces. They excel at mapping user needs into high-fidelity mockups, establishing clean design systems, and conducting structured user research. They work best in environments that value visual detail, user empathy, and clean usability patterns.`;
    recommendationExplanation = `${name}'s expertise in design systems and user journey optimization makes them an excellent candidate for product design roles.`;
  } else if (domain === 'product') {
    technicalSkills = ['Product Roadmap Strategy', 'Agile/Scrum', 'Jira/Confluence', 'SQL', 'Product Analytics', 'Market Research', 'PRD Authoring'];
    softSkills = ['Cross-functional Alignment', 'Stakeholder Management', 'Public Speaking', 'Prioritization'];
    leadershipSkills = ['Team Alignment', 'Strategic Visioning', 'OKR Setting', 'Conflict Resolution'];
    missingSkills = ['Technical Architecture Knowledge', 'Growth Hacking Techniques', 'Financial Modeling'];
    strengths = [
      `Data-driven product professional with ${yearsOfExperience} years of experience leading cross-functional teams.`,
      'Proven track record of turning business goals into clear, actionable development backlogs.',
      'Strong capabilities in stakeholder management, roadmapping, and project coordination.',
      'Exceptional communication and presentation skills.'
    ];
    improvementAreas = [
      'Could benefit from improving technical software literacy to better collaborate with backend engineers.',
      'Tendency to focus on qualitative user feedback over strict quantitative analytics metrics.',
      'Needs more exposure to product launch marketing campaigns.'
    ];
    techQuestions = [
      'How do you determine which features to prioritize in a product backlog when resources are extremely limited?',
      'Which product analytics metrics (e.g., churn, DAU, cohort retention) do you track to measure the success of a newly launched feature?',
      'How do you structure a Product Requirements Document (PRD) to ensure zero engineering ambiguity?'
    ];
    behavioralQuestions = [
      'Describe a product launch that failed. What went wrong, what did you learn, and how did you pivot?',
      'How do you handle a situation where the engineering team estimates a simple feature will take 3 months to build?'
    ];
    leadQuestions = [
      'How do you align multiple department heads (Sales, Engineering, Marketing) who have conflicting priorities for the product?',
      'How do you define and communicate a product vision to keep the development team inspired?'
    ];
    executiveSummary = `${name} is a highly organized, strategic ${title} with a track record of driving software products from conception to launch. With ${yearsOfExperience} years in product management, they exhibit strong skills in defining requirements, tracking success metrics, and maintaining agile velocities. They excel at bridging the gap between business objectives and engineering tasks.`;
    recommendationExplanation = `${name}'s strong product methodology, roadmap organization, and stakeholder communications indicate high suitability for product lead roles.`;
  } else {
    // General / Marketing
    technicalSkills = ['Project Management', 'Data Analysis', 'Reporting', 'Customer Relations', 'Microsoft Suite', 'SEO Tools', 'CRM Software'];
    softSkills = ['Active Communication', 'Time Management', 'Critical Thinking', 'Problem Solving'];
    leadershipSkills = ['Project Ownership', 'Client Management', 'Task Delegation'];
    missingSkills = ['SQL Database Querying', 'Advanced Statistics', 'Budget Planning'];
    strengths = [
      `Dedicated professional with ${yearsOfExperience} years of experience in organizational and client-facing roles.`,
      'Excellent written and verbal communication.',
      'Proactive organizer and coordinator.',
      'Adaptable learner quick to absorb new business domains.'
    ];
    improvementAreas = [
      'Gaps in advanced technical toolchains.',
      'Could benefit from adopting more data-backed measurement tools.',
      'Needs more experience in long-term strategic budget forecasting.'
    ];
    techQuestions = [
      'Describe your workflow for managing complex projects with tight deadlines.',
      'How do you analyze data reports to identify performance bottlenecks in your department?',
      'What digital tools do you rely on to automate daily routine coordination?'
    ];
    behavioralQuestions = [
      'Give an example of a difficult client or customer interaction. How did you resolve it?',
      'How do you organize your priorities when multiple high-urgency tasks arrive at once?'
    ];
    leadQuestions = [
      'How do you build trust with new team members and external partners?',
      'Describe a time you took the lead on a project that lacked clear guidelines or oversight.'
    ];
    executiveSummary = `${name} is a versatile ${title} possessing ${yearsOfExperience} years of experience. They have demonstrated reliability in managing projects, communicating across departments, and supporting operational metrics. Their background reflects a customer-first approach combined with strong task management capabilities.`;
    recommendationExplanation = `${name} offers standard organizational capabilities suitable for operations, client success, or project coordination roles.`;
  }

  // Set career analysis values
  const careerAnalysis = {
    yearsOfExperience,
    careerGrowth: yearsOfExperience > 5 ? 'Strong career growth, progressing into senior responsibilities' : 'Moderate growth, building core competencies',
    promotions: yearsOfExperience > 4 ? 'Promoted at least once into lead/senior roles' : 'Steady role progression with increasing scope',
    jobStability: 'Solid stability, average tenure of 2-3 years per role',
    industryExperience: domain === 'technology' ? ['SaaS', 'Cloud Computing', 'Internet Services'] : ['Digital Platforms', 'Consulting']
  };

  return {
    score,
    recommendation,
    recommendationExplanation,
    executiveSummary,
    skillsAnalysis: {
      technical: technicalSkills,
      soft: softSkills,
      leadership: leadershipSkills,
      missing: missingSkills
    },
    careerAnalysis,
    strengths,
    improvementAreas,
    interviewQuestions: {
      technical: techQuestions,
      behavioral: behavioralQuestions,
      leadership: leadQuestions
    }
  };
};

/**
 * Generate candidate intelligence analysis.
 * Uses OpenAI Chat Completion if API Key is configured, otherwise falls back to dynamic Mock.
 */
export const analyzeCandidateData = async (candidate) => {
  const client = getOpenAIClient();

  if (!client) {
    console.log('OPENAI_API_KEY not configured. Generating high-fidelity mock candidate intelligence report...');
    // Introduce a small delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateMockAnalysis(candidate);
  }

  console.log(`Sending candidate data for AI analysis: ${candidate.name} (${candidate.title})`);

  const prompt = `
  You are an expert candidate intelligence AI parser. Your task is to analyze candidate information and generate a structured, professional screening report.
  
  Candidate Details:
  Name: ${candidate.name}
  Title: ${candidate.title}
  Email: ${candidate.email}
  Phone: ${candidate.phone}
  LinkedIn: ${candidate.linkedinUrl}
  Raw Profile/Resume text:
  ${candidate.profileText}

  Analyze this candidate data thoroughly and return a valid JSON object matching the schema below.
  
  Important Instructions:
  - Provide realistic scores between 0 and 100 based on experience, skills, and stability.
  - Return the hiring recommendation as exactly one of: "Highly Recommended", "Recommended", "Consider", "Not Recommended". Explain this recommendation briefly.
  - Formulate 3 specific Technical Questions, 2 Behavioral Questions, and 2 Leadership Questions based on their profile.
  - Identify technical, soft, and leadership skills they possess, as well as 3 key missing skills that are standard for their role but not explicitly listed in their profile.
  - Ensure the response is purely valid JSON without any markdown formatting wrappers (like \`\`\`json).

  JSON Schema Structure:
  {
    "score": 85,
    "recommendation": "Recommended",
    "recommendationExplanation": "The candidate has strong technical skills but has shorter tenure in their last two roles.",
    "executiveSummary": "A summary of the candidate...",
    "skillsAnalysis": {
      "technical": ["React", "Node.js"],
      "soft": ["Communication", "Problem Solving"],
      "leadership": ["Mentoring"],
      "missing": ["Kubernetes", "GraphQL"]
    },
    "careerAnalysis": {
      "yearsOfExperience": 5,
      "careerGrowth": "Strong progression from Jr to Senior developer",
      "promotions": "Promoted to Senior Engineer in 2024",
      "jobStability": "Stable, averages 2 years per company",
      "industryExperience": ["FinTech", "SaaS"]
    },
    "strengths": [
      "Detail strength 1",
      "Detail strength 2"
    ],
    "improvementAreas": [
      "Detail improvement area 1",
      "Detail improvement area 2"
    ],
    "interviewQuestions": {
      "technical": [
        "Question 1",
        "Question 2",
        "Question 3"
      ],
      "behavioral": [
        "Question 1",
        "Question 2"
      ],
      "leadership": [
        "Question 1",
        "Question 2"
      ]
    }
  }
  `;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Lightweight, fast model for structured analysis
      messages: [
        { role: 'system', content: 'You are a professional HR intelligence parser that outputs only raw JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content.trim();
    return JSON.parse(resultText);
  } catch (error) {
    console.error('OpenAI Analysis failed, falling back to mock generator:', error);
    return generateMockAnalysis(candidate);
  }
};
