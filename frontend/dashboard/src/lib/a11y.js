export function getCandidateAriaLabel(candidate) {
  return `${candidate.name}, rank ${candidate.rank || 'unranked'}, total score ${candidate.total_score?.toFixed(1) || '0.0'}`
}

export function getMetricAriaLabel(metricName, score) {
  return `${metricName}: ${score.toFixed(1)} out of 100`
}

export function handleCardKeyPress(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

export function getSearchAriaLabel(totalCandidates) {
  return `Search candidates by name. ${totalCandidates} total candidates.`
}

export function getSkillFilterAriaLabel(skills) {
  return `Filter candidates by skills. ${skills.length} skills available.`
}

export function hasGoodContrast(foreground, background) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.replace('#', ''), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  
  return ratio >= 4.5
}

export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  const handleTab = (e) => {
    if (e.key !== 'Tab') return
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
  
  element.addEventListener('keydown', handleTab)
  
  return () => element.removeEventListener('keydown', handleTab)
}

export function announceToScreenReader(message) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}
