import { extractTextFromBuffer } from '../utils/textExtractor.js';
import { analyzeCandidateData } from '../services/aiService.js';
import assert from 'assert';

console.log('================================================');
console.log('RUNNING HIRESIGHT BACKEND VERIFICATION TESTS...');
console.log('================================================');

async function testTextExtraction() {
  console.log('\n[TEST] Verifying Text Extraction from TXT buffer...');
  const textBuffer = Buffer.from('John Doe Software Resume Details here.');
  const text = await extractTextFromBuffer(textBuffer, 'text/plain');
  assert.strictEqual(text, 'John Doe Software Resume Details here.');
  console.log('✓ Text extraction passed.');
}

async function testAIServiceMockFallback() {
  console.log('\n[TEST] Verifying AI Service Fallback Mock Generator...');
  
  const mockCandidate = {
    name: 'Jane Smith',
    title: 'Senior UX Designer',
    email: 'jane@smithdesign.com',
    phone: '555-1122',
    linkedinUrl: 'https://linkedin.com/in/janesmith',
    profileText: 'Experienced UI/UX Designer with 6+ years of experience. Expert in Figma and design systems.'
  };

  const analysis = await analyzeCandidateData(mockCandidate);

  // Assertions for score, recommendation, summary and list structures
  assert.ok(analysis.score >= 0 && analysis.score <= 100, 'Score is not between 0 and 100');
  assert.ok(['Highly Recommended', 'Recommended', 'Consider', 'Not Recommended'].includes(analysis.recommendation), 'Invalid recommendation outcome');
  assert.ok(analysis.executiveSummary.includes('Jane Smith'), 'Executive summary does not contain candidate name');
  assert.ok(analysis.skillsAnalysis.technical.includes('Figma'), 'Technical skills does not contain detected skill Figma');
  assert.ok(analysis.careerAnalysis.yearsOfExperience >= 6, 'Experience was not parsed correctly');
  assert.ok(analysis.strengths.length > 0, 'Strengths array is empty');
  assert.ok(analysis.interviewQuestions.technical.length > 0, 'Interview questions array is empty');

  console.log(`✓ AI Service parsed "${mockCandidate.name}" correctly.`);
  console.log(`  - Fit Score: ${analysis.score}`);
  console.log(`  - Recommendation: ${analysis.recommendation}`);
  console.log(`  - Detected Experience: ${analysis.careerAnalysis.yearsOfExperience} years`);
  console.log('✓ AI Fallback parser validation passed.');
}

async function runAllTests() {
  try {
    await testTextExtraction();
    await testAIServiceMockFallback();
    console.log('\n================================================');
    console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  }
}

runAllTests();
