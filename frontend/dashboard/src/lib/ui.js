export const metricColors = {
  crisis: '#d9534f',
  crisis_management: '#d9534f',
  sustainability: '#28a745',
  team: '#2b7be4',
  team_motivation: '#2b7be4',
}

export function getScoreTier(totalScore) {
  if (totalScore >= 85) {
    return {
      tier: 'high',
      color: '#28a745',
      label: 'Excellent',
      background: 'rgba(40, 167, 69, 0.08)',
    }
  } else if (totalScore >= 70) {
    return {
      tier: 'mid',
      color: '#0f62fe',
      label: 'Good',
      background: 'rgba(15, 98, 254, 0.08)',
    }
  } else {
    return {
      tier: 'low',
      color: '#d9534f',
      label: 'Needs Improvement',
      background: 'rgba(217, 83, 79, 0.08)',
    }
  }
}

export function formatYears(years) {
  if (years === 1) return '1 year'
  return `${years} years`
}

export function getRankBadgeStyle(rank) {
  if (rank === 1) {
    return {
      className: 'rank-badge rank-badge-1',
      color: '#f59e0b',
      label: '🏆',
    }
  } else if (rank === 2) {
    return {
      className: 'rank-badge rank-badge-2',
      color: '#9ca3af',
      label: '🥈',
    }
  } else if (rank === 3) {
    return {
      className: 'rank-badge rank-badge-3',
      color: '#d97706',
      label: '🥉',
    }
  } else {
    return {
      className: 'rank-badge rank-badge-other',
      color: '#6b7280',
      label: null,
    }
  }
}

export function getMetricStyle(metricKey) {
  const key = metricKey.toLowerCase()
  
  if (key.includes('crisis')) {
    return {
      color: metricColors.crisis,
      background: 'rgba(217, 83, 79, 0.08)',
      label: 'Crisis Management',
    }
  } else if (key.includes('sustainability')) {
    return {
      color: metricColors.sustainability,
      background: 'rgba(40, 167, 69, 0.08)',
      label: 'Sustainability',
    }
  } else if (key.includes('team')) {
    return {
      color: metricColors.team,
      background: 'rgba(43, 123, 228, 0.08)',
      label: 'Team Motivation',
    }
  }
  
  return {
    color: '#6b7280',
    background: 'rgba(107, 114, 128, 0.08)',
    label: 'Unknown',
  }
}

export function formatScore(score) {
  return typeof score === 'number' ? score.toFixed(1) : '0.0'
}

export function getContrastColor(backgroundColor) {
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#111827' : '#ffffff'
}

export function truncate(text, maxLength = 50) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}
