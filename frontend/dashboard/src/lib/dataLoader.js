import candidatesRaw from '../data/candidates.json'

let cachedCandidates = null
let cachedRankings = null
let cachedSkillAverages = null

const STORAGE_KEY = 'recycling_manager_candidates'

export function clearCache() {
  cachedCandidates = null
  cachedRankings = null
  cachedSkillAverages = null
}

export function saveCandidates(candidates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates))
    clearCache()
  } catch (error) {
    console.error('Failed to save candidates to localStorage:', error)
  }
}

export function loadCandidates() {
  if (cachedCandidates) return cachedCandidates
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.length > 0) {
        cachedCandidates = parsed.map(candidate => ({
          ...candidate,
          crisis_management_score: candidate.crisis_management_score || 0,
          sustainability_score: candidate.sustainability_score || 0,
          team_motivation_score: candidate.team_motivation_score || 0,
          total_score: candidate.total_score || computeTotalScore(candidate)
        }))
        return cachedCandidates
      }
    }
  } catch (error) {
    console.warn('Failed to load from localStorage, using default data:', error)
  }
  
  cachedCandidates = candidatesRaw.map(candidate => ({
    ...candidate,
    crisis_management_score: candidate.crisis_management_score || 0,
    sustainability_score: candidate.sustainability_score || 0,
    team_motivation_score: candidate.team_motivation_score || 0,
    total_score: candidate.total_score || computeTotalScore(candidate)
  }))
  
  return cachedCandidates
}

export function computeTotalScore(candidate) {
  const crisis = candidate.crisis_management_score || 0
  const sustainability = candidate.sustainability_score || 0
  const team = candidate.team_motivation_score || 0
  return (crisis + sustainability + team) / 3
}

export function computeRankings(candidates) {
  if (cachedRankings) return cachedRankings
  
  const sorted = [...candidates].sort((a, b) => b.total_score - a.total_score)
  
  cachedRankings = sorted.map((candidate, index) => ({
    ...candidate,
    rank: index + 1
  }))
  
  return cachedRankings
}

export function computeSkillAverages(candidates) {
  if (cachedSkillAverages) return cachedSkillAverages
  
  const skillStats = {}
  
  candidates.forEach(candidate => {
    candidate.skills.forEach(skill => {
      if (!skillStats[skill]) {
        skillStats[skill] = {
          skill,
          crisis_total: 0,
          sustainability_total: 0,
          team_total: 0,
          total_score: 0,
          count: 0
        }
      }
      
      skillStats[skill].crisis_total += candidate.crisis_management_score
      skillStats[skill].sustainability_total += candidate.sustainability_score
      skillStats[skill].team_total += candidate.team_motivation_score
      skillStats[skill].total_score += candidate.total_score
      skillStats[skill].count += 1
    })
  })
  
  cachedSkillAverages = Object.values(skillStats)
    .map(stat => ({
      skill: stat.skill,
      count: stat.count,
      avgCrisis: stat.crisis_total / stat.count,
      avgSustainability: stat.sustainability_total / stat.count,
      avgTeam: stat.team_total / stat.count,
      avgTotal: stat.total_score / stat.count
    }))
    .sort((a, b) => b.avgTotal - a.avgTotal)
  
  return cachedSkillAverages
}

export function getAllSkills(candidates) {
  const skills = new Set()
  candidates.forEach(candidate => {
    candidate.skills.forEach(skill => skills.add(skill))
  })
  return Array.from(skills).sort()
}

export function getScoreTierColor(score) {
  if (score >= 85) return 'green'
  if (score >= 70) return 'yellow'
  return 'red'
}

export function getMetricColor(metric) {
  const colorMap = {
    crisis: 'red',
    crisis_management: 'red',
    crisis_management_score: 'red',
    sustainability: 'green',
    sustainability_score: 'green',
    team: 'blue',
    team_motivation: 'blue',
    team_motivation_score: 'blue'
  }
  return colorMap[metric.toLowerCase()] || 'gray'
}
