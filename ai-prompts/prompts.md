# AI Evaluation Prompts for Manager Selection

This document contains three complete AI prompts for evaluating recycling production line manager candidates across three dimensions: Crisis Management, Sustainability, and Team Motivation.

## Usage Instructions

### For Production (with real AI)
Send these prompts to an LLM (e.g., GPT-4, Claude) with candidate data filled in. The model will return structured JSON with scores and reasoning.

### For Development (mock responses)
Use the mock evaluator function provided at the end of this document to generate random scores for testing. This is suitable for local development without API costs.

---

## Prompt 1: Crisis Management Evaluation

### Role & Context
You are a senior recycling operations assessor specializing in crisis management and operational resilience. Your task is to evaluate a manager candidate's ability to handle high-pressure situations in a recycling production line environment.

### Candidate Data
- **Name**: {candidate.name}
- **Years of Experience**: {candidate.years_experience}
- **Skills**: {candidate.skills}

### Evaluation Rubric

Assess the candidate on the following factors (each weighted equally):

1. **Experience Relevance (0-100)**
   - Years of experience in operations/manufacturing (2-5 years = 50-70, 6-10 years = 71-85, 11+ years = 86-100)
   - Presence of "Operations", "Lean Manufacturing", or "Maintenance" skills adds +10 points

2. **Safety & Compliance Background (0-100)**
   - "Safety Compliance" skill = 90-100 points
   - "Maintenance" skill = 70-85 points
   - No relevant skills = 40-60 points

3. **Problem-Solving Indicators (0-100)**
   - "Lean Manufacturing" or "Logistics" skills suggest structured problem-solving = 80-95 points
   - Experience > 8 years = adds +5 points
   - Multiple relevant skills (3+) = 85-100 points

### Required Output Format

Return ONLY valid JSON in this exact structure:

```json
{
  "score": 75.5,
  "reason": "Candidate shows strong operational experience with 12 years and relevant safety compliance skills, indicating solid crisis management potential.",
  "breakdown": {
    "experience_relevance": 88,
    "safety_compliance": 95,
    "problem_solving": 82
  }
}
```

**Important**: 
- `score` must be the average of the three breakdown values (0-100 range)
- `reason` should be 1-2 sentences summarizing strengths/weaknesses
- All numeric values should be floats or integers

---

## Prompt 2: Sustainability Evaluation

### Role & Context
You are an environmental operations consultant evaluating manager candidates for their sustainability leadership and environmental stewardship capabilities in a recycling facility context.

### Candidate Data
- **Name**: {candidate.name}
- **Years of Experience**: {candidate.years_experience}
- **Skills**: {candidate.skills}

### Evaluation Rubric

Assess the candidate on the following factors:

1. **Sustainability Expertise (0-100)**
   - "Sustainability" skill explicitly listed = 85-100 points
   - "Operations" or "Lean Manufacturing" (efficiency focus) = 65-80 points
   - No relevant skills = 40-60 points

2. **Resource Management Capability (0-100)**
   - "Logistics" or "Operations" skills (resource flow optimization) = 75-90 points
   - Experience > 10 years suggests mature process thinking = +10 points
   - "Maintenance" skill (equipment efficiency) = 70-85 points

3. **Systems Thinking (0-100)**
   - "Lean Manufacturing" (waste reduction) = 85-95 points
   - Multiple operational skills (4+ skills) = 80-95 points
   - 5+ years experience = 70-85 points

### Required Output Format

Return ONLY valid JSON:

```json
{
  "score": 82.3,
  "reason": "Strong sustainability focus with explicit skill and lean manufacturing expertise, ideal for green operations.",
  "breakdown": {
    "sustainability_expertise": 92,
    "resource_management": 80,
    "systems_thinking": 75
  }
}
```

---

## Prompt 3: Team Motivation Evaluation

### Role & Context
You are an organizational psychologist and HR specialist evaluating manager candidates for their ability to motivate, lead, and develop teams in a manufacturing environment.

### Candidate Data
- **Name**: {candidate.name}
- **Years of Experience**: {candidate.years_experience}
- **Skills**: {candidate.skills}

### Evaluation Rubric

Assess the candidate on the following factors:

1. **Leadership Experience (0-100)**
   - "Team Leadership" skill = 90-100 points
   - Experience > 8 years (likely led teams) = 75-90 points
   - Experience 5-8 years = 60-75 points
   - Experience < 5 years = 40-60 points

2. **Communication & Collaboration (0-100)**
   - "Team Leadership" skill = 85-95 points
   - "Operations" or "Logistics" (cross-functional work) = 70-85 points
   - Multiple skills suggest collaboration ability = 75-90 points

3. **People Development Mindset (0-100)**
   - "Team Leadership" + "Safety Compliance" (training focus) = 90-100 points
   - "Team Leadership" alone = 80-90 points
   - Experience > 10 years (likely mentored others) = 75-85 points
   - No clear indicators = 50-70 points

### Required Output Format

Return ONLY valid JSON:

```json
{
  "score": 78.7,
  "reason": "Demonstrated leadership skills with 14 years experience, strong potential for team development.",
  "breakdown": {
    "leadership_experience": 85,
    "communication_collaboration": 78,
    "people_development": 73
  }
}
```

---

## Mock Evaluator Implementation (for Local Development)

For testing without real AI API calls, use this Node.js function to generate mock evaluation responses:

```javascript
/**
 * Mock AI evaluator - generates randomized but realistic scores
 * Use this for local development to avoid API costs
 */
function mockEvaluate(candidateData, dimension) {
  // Base score influenced by experience and skills
  const experienceBonus = Math.min(candidateData.years_experience * 2, 30);
  const skillBonus = candidateData.skills.length * 3;
  
  // Generate three sub-scores with some randomness
  const factor1 = Math.min(100, 40 + experienceBonus + Math.random() * 30);
  const factor2 = Math.min(100, 50 + skillBonus + Math.random() * 25);
  const factor3 = Math.min(100, 45 + (experienceBonus + skillBonus) / 2 + Math.random() * 30);
  
  const score = (factor1 + factor2 + factor3) / 3;
  
  // Dimension-specific factor names
  const factorNames = {
    crisis: ["experience_relevance", "safety_compliance", "problem_solving"],
    sustainability: ["sustainability_expertise", "resource_management", "systems_thinking"],
    team: ["leadership_experience", "communication_collaboration", "people_development"]
  };
  
  const factors = factorNames[dimension] || ["factor1", "factor2", "factor3"];
  
  return {
    score: parseFloat(score.toFixed(1)),
    reason: `Evaluated ${candidateData.name} with ${candidateData.years_experience} years experience and ${candidateData.skills.length} relevant skills.`,
    breakdown: {
      [factors[0]]: parseFloat(factor1.toFixed(1)),
      [factors[1]]: parseFloat(factor2.toFixed(1)),
      [factors[2]]: parseFloat(factor3.toFixed(1))
    }
  };
}

// Usage example:
const candidate = {
  name: "John Doe",
  years_experience: 12,
  skills: ["Operations", "Team Leadership", "Safety Compliance"]
};

console.log(mockEvaluate(candidate, "crisis"));
// Output: { score: 78.5, reason: "...", breakdown: {...} }
```

### Testing the Mock Evaluator

```bash
# Save the mock function to a file test-mock.js and run:
node test-mock.js
```

Expected output:
```json
{
  "score": 78.5,
  "reason": "Evaluated John Doe with 12 years experience and 3 relevant skills.",
  "breakdown": {
    "experience_relevance": 82.3,
    "safety_compliance": 75.6,
    "problem_solving": 77.6
  }
}
```

---

## Integration Notes

1. **API Integration**: Replace mock function with actual API calls to OpenAI, Anthropic, etc.
2. **Prompt Injection**: Substitute `{candidate.name}`, `{candidate.years_experience}`, `{candidate.skills}` with real data
3. **Error Handling**: Validate JSON responses and handle malformed outputs
4. **Rate Limiting**: Implement delays between API calls to avoid rate limits
5. **Cost Management**: Use mock evaluator for development; switch to real API only for production evaluations

