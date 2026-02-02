const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

const NUM_CANDIDATES = 40;
const SKILL_POOL = [
    'Operations',
    'Lean Manufacturing',
    'Safety Compliance',
    'Sustainability',
    'Team Leadership',
    'Maintenance',
    'Logistics'
];

function generateCandidate(id) {
    const name = faker.person.fullName();
    const yearsExperience = faker.number.int({ min: 2, max: 20 });
    
    const numSkills = faker.number.int({ min: 5, max: 8 });
    const skills = faker.helpers.arrayElements(SKILL_POOL, numSkills);
    
    const crisisScore = faker.number.float({ min: 40, max: 100, precision: 0.1 });
    const sustainabilityScore = faker.number.float({ min: 40, max: 100, precision: 0.1 });
    const teamScore = faker.number.float({ min: 40, max: 100, precision: 0.1 });
    const totalScore = (crisisScore + sustainabilityScore + teamScore) / 3;
    
    return {
        id,
        name,
        yearsExperience,
        skills,
        evaluation: {
            crisis_management_score: crisisScore,
            sustainability_score: sustainabilityScore,
            team_motivation_score: teamScore,
            total_score: totalScore
        }
    };
}

function generateAllCandidates() {
    const candidates = [];
    for (let i = 1; i <= NUM_CANDIDATES; i++) {
        candidates.push(generateCandidate(i));
    }
    return candidates;
}

function generateSeedSQL(candidates) {
    let sql = '';
    
    sql += '-- =====================================================\n';
    sql += '-- Seed Data for Recycling Production Line Manager Selection System\n';
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Total Candidates: ${NUM_CANDIDATES}\n`;
    sql += '-- =====================================================\n\n';
    
    candidates.forEach(candidate => {
        const skillsJSON = JSON.stringify(candidate.skills).replace(/'/g, "\\'");
        sql += `INSERT INTO candidates (name, years_experience, skills) VALUES ('${candidate.name}', ${candidate.yearsExperience}, '${skillsJSON}');\n`;
    });
    
    sql += '\n-- Insert evaluations (with auto-computed total_score via trigger)\n';
    candidates.forEach((candidate, index) => {
        const candidateId = index + 1;
        const { crisis_management_score, sustainability_score, team_motivation_score } = candidate.evaluation;
        sql += `INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES (${candidateId}, ${crisis_management_score}, ${sustainability_score}, ${team_motivation_score});\n`;
    });
    
    sql += '\n-- Rankings will be auto-populated by triggers\n';
    
    return sql;
}

function generateCandidatesJSON(candidates) {
    return candidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        years_experience: candidate.yearsExperience,
        skills: candidate.skills,
        crisis_management_score: candidate.evaluation.crisis_management_score,
        sustainability_score: candidate.evaluation.sustainability_score,
        team_motivation_score: candidate.evaluation.team_motivation_score,
        total_score: candidate.evaluation.total_score
    }));
}

function main() {
    console.log('🎲 Generating candidate data...');
    
    const candidates = generateAllCandidates();
    console.log(`✓ Generated ${candidates.length} candidates`);
    
    const seedSQL = generateSeedSQL(candidates);
    const sqlPath = path.join(__dirname, '../database/seed.sql');
    fs.writeFileSync(sqlPath, seedSQL, 'utf8');
    console.log(`✓ Created ${sqlPath}`);
    
    const candidatesJSON = generateCandidatesJSON(candidates);
    const jsonPath = path.join(__dirname, '../frontend/dashboard/src/data/candidates.json');
    fs.writeFileSync(jsonPath, JSON.stringify(candidatesJSON, null, 2), 'utf8');
    console.log(`✓ Created ${jsonPath}`);
    
    console.log('\n📊 Statistics:');
    console.log(`   Total candidates: ${candidates.length}`);
    console.log(`   Avg experience: ${(candidates.reduce((sum, c) => sum + c.yearsExperience, 0) / candidates.length).toFixed(1)} years`);
    console.log(`   Avg total score: ${(candidates.reduce((sum, c) => sum + c.evaluation.total_score, 0) / candidates.length).toFixed(1)}`);
    
    const sorted = [...candidates].sort((a, b) => b.evaluation.total_score - a.evaluation.total_score);
    console.log('\n🏆 Top 3 candidates:');
    sorted.slice(0, 3).forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name} - ${c.evaluation.total_score.toFixed(1)} points`);
    });
    
    console.log('\n✅ Generation complete!');
}

if (require.main === module) {
    main();
}

module.exports = { generateCandidate, generateAllCandidates };
