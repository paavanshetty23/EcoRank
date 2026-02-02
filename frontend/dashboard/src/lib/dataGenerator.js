import { faker } from '@faker-js/faker'

const NUM_CANDIDATES = 40
const SKILL_POOL = [
  'Operations',
  'Lean Manufacturing',
  'Safety Compliance',
  'Sustainability',
  'Team Leadership',
  'Maintenance',
  'Logistics'
]

function generateCandidate(id) {
  const name = faker.person.fullName()
  const yearsExperience = faker.number.int({ min: 2, max: 20 })
  
  const numSkills = faker.number.int({ min: 5, max: 8 })
  const skills = faker.helpers.arrayElements(SKILL_POOL, numSkills)
  
  const crisisScore = faker.number.float({ min: 40, max: 100, fractionDigits: 1 })
  const sustainabilityScore = faker.number.float({ min: 40, max: 100, fractionDigits: 1 })
  const teamScore = faker.number.float({ min: 40, max: 100, fractionDigits: 1 })
  const totalScore = parseFloat(((crisisScore + sustainabilityScore + teamScore) / 3).toFixed(1))
  
  return {
    id,
    name,
    years_experience: yearsExperience,
    skills,
    crisis_management_score: crisisScore,
    sustainability_score: sustainabilityScore,
    team_motivation_score: teamScore,
    total_score: totalScore,
    created_at: new Date().toISOString()
  }
}

export function generateAllCandidates(count = NUM_CANDIDATES) {
  const candidates = []
  for (let i = 1; i <= count; i++) {
    candidates.push(generateCandidate(i))
  }
  
  candidates.sort((a, b) => b.total_score - a.total_score)
  
  candidates.forEach((candidate, index) => {
    candidate.rank_position = index + 1
  })
  
  candidates.sort((a, b) => a.id - b.id)
  
  return candidates
}

export function generateSQL(candidates) {
  let sql = `-- Auto-generated seed data for Recycling Manager Selection System
-- Generated: ${new Date().toISOString()}
-- Candidates: ${candidates.length}

-- Clear existing data
DELETE FROM rankings;
DELETE FROM evaluations;
DELETE FROM candidates;

-- Reset auto-increment
ALTER TABLE candidates AUTO_INCREMENT = 1;

-- Insert candidates
`

  candidates.forEach(candidate => {
    const skillsJSON = JSON.stringify(candidate.skills).replace(/'/g, "''")
    sql += `INSERT INTO candidates (id, name, years_experience, skills, created_at) VALUES 
(${candidate.id}, '${candidate.name.replace(/'/g, "''")}', ${candidate.years_experience}, '${skillsJSON}', '${candidate.created_at}');\n`
  })

  sql += `\n-- Insert evaluations (triggers will auto-compute total_score and rankings)\n`

  candidates.forEach(candidate => {
    sql += `INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES 
(${candidate.id}, ${candidate.crisis_management_score}, ${candidate.sustainability_score}, ${candidate.team_motivation_score});\n`
  })

  sql += `\n-- Verification query
-- SELECT c.id, c.name, e.total_score, r.rank_position 
-- FROM candidates c 
-- JOIN evaluations e ON c.id = e.candidate_id 
-- JOIN rankings r ON c.id = r.candidate_id 
-- ORDER BY r.rank_position LIMIT 10;
`

  return sql
}

export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
