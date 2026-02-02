import { Box, Title, Text, Badge, Group, Stack, Progress, Button, Modal, Code, Tooltip } from '@mantine/core'
import { IconCopy, IconCheck, IconFileInfo } from '@tabler/icons-react'
import { useState } from 'react'
import { getScoreTier, formatScore, formatYears } from '../lib/ui'
import { getCandidateAriaLabel, handleCardKeyPress } from '../lib/a11y'

function CandidateCard({ candidate, compact = false }) {
  const [copied, setCopied] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const tierInfo = getScoreTier(candidate.total_score)

  const handleShareCandidate = () => {
    const minimalJSON = JSON.stringify({
      id: candidate.id,
      name: candidate.name,
      total_score: formatScore(candidate.total_score)
    }, null, 2)
    
    navigator.clipboard.writeText(minimalJSON)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const openDetails = () => setDetailsOpen(true)

  return (
    <>
      <Box 
        className="professional-card"
        component="article"
        aria-label={getCandidateAriaLabel(candidate)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => handleCardKeyPress(e, openDetails)}
        style={{ position: 'relative' }}
      >
        {candidate.rank && (
          <div 
            className={
              candidate.rank === 1 ? 'rank-badge rank-badge-1' :
              candidate.rank === 2 ? 'rank-badge rank-badge-2' :
              candidate.rank === 3 ? 'rank-badge rank-badge-3' :
              'rank-badge rank-badge-other'
            }
            style={{
              position: 'absolute',
              top: 12,
              left: 12
            }}
          >
            {candidate.rank === 1 ? '🏆' : candidate.rank}
          </div>
        )}
        
        <Stack gap="sm" style={{ marginLeft: candidate.rank ? '50px' : '0' }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div style={{ flex: 1 }}>
              <Title order={3} size="h4" fw={600} c="var(--text-strong)">
                {candidate.name}
              </Title>
              <Text size="sm" c="var(--text-muted)">
                {formatYears(candidate.years_experience)} of experience
              </Text>
            </div>
            
            <Tooltip label={tierInfo.label}>
              <Box
                style={{
                  background: '#ffffff',
                  border: `2px solid ${tierInfo.color}`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                <Text 
                  size="xl" 
                  fw={700} 
                  style={{ color: tierInfo.color }}
                  ta="center"
                >
                  {formatScore(candidate.total_score)}
                </Text>
              </Box>
            </Tooltip>
          </Group>

          <div>
            <Text size="sm" fw={500} mb={6} c="var(--text-muted)">
              Skills
            </Text>
            <Group gap={6} style={{ flexWrap: 'wrap' }}>
              {candidate.skills.map((skill, idx) => (
                <Badge 
                  key={idx} 
                  variant="light" 
                  color="cyan" 
                  size="sm"
                  radius="sm"
                  style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  {skill}
                </Badge>
              ))}
            </Group>
          </div>

          {!compact && (
            <Stack gap="sm" mt="sm">
              <Text size="sm" fw={500} c="var(--text-muted)">
                Evaluation Scores
              </Text>
              
              <div>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" c="var(--text-muted)">Crisis Management</Text>
                  <Text size="sm" fw={600} style={{ color: '#d9534f' }}>
                    {formatScore(candidate.crisis_management_score)}
                  </Text>
                </Group>
                <Progress 
                  value={candidate.crisis_management_score} 
                  color="#d9534f"
                  size="sm"
                  radius="sm"
                  aria-label={`Crisis management score: ${formatScore(candidate.crisis_management_score)}`}
                />
              </div>

              <div>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" c="var(--text-muted)">Sustainability</Text>
                  <Text size="sm" fw={600} style={{ color: '#28a745' }}>
                    {formatScore(candidate.sustainability_score)}
                  </Text>
                </Group>
                <Progress 
                  value={candidate.sustainability_score} 
                  color="#28a745"
                  size="sm"
                  radius="sm"
                  aria-label={`Sustainability score: ${formatScore(candidate.sustainability_score)}`}
                />
              </div>

              <div>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" c="var(--text-muted)">Team Motivation</Text>
                  <Text size="sm" fw={600} style={{ color: '#2b7be4' }}>
                    {formatScore(candidate.team_motivation_score)}
                  </Text>
                </Group>
                <Progress 
                  value={candidate.team_motivation_score} 
                  color="#2b7be4"
                  size="sm"
                  radius="sm"
                  aria-label={`Team motivation score: ${formatScore(candidate.team_motivation_score)}`}
                />
              </div>
            </Stack>
          )}
          
          <Group justify="flex-end" mt="md" gap="xs" style={{ 
            borderTop: '1px solid var(--surface-border)',
            paddingTop: '12px'
          }}>
            <Button
              variant="subtle"
              size="sm"
              leftSection={<IconFileInfo size={16} />}
              onClick={openDetails}
              aria-label="View full candidate details"
            >
              Details
            </Button>
            
            <Button
              variant="light"
              size="sm"
              color={copied ? 'green' : 'blue'}
              leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              onClick={handleShareCandidate}
              aria-label={copied ? 'Copied to clipboard' : 'Share candidate'}
            >
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </Group>
        </Stack>
      </Box>
      
      <Modal
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Full Profile: ${candidate.name}`}
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="var(--text-muted)">
            Complete candidate data in JSON format:
          </Text>
          <Code block style={{ 
            maxHeight: '400px', 
            overflow: 'auto',
            background: '#f9fafb',
            border: '1px solid var(--surface-border)'
          }}>
            {JSON.stringify(candidate, null, 2)}
          </Code>
          <Button 
            fullWidth 
            variant="light"
            leftSection={<IconCopy size={16} />}
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(candidate, null, 2))
            }}
          >
            Copy to Clipboard
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default CandidateCard
