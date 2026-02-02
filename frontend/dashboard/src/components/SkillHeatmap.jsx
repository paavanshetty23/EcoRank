import { Box, Title, Text, Stack, Group, Badge } from '@mantine/core'
import { computeSkillAverages } from '../lib/dataLoader'
import { formatScore } from '../lib/ui'

function SkillHeatmap({ candidates }) {
  const skillAverages = computeSkillAverages(candidates)

  return (
    <Box style={{ background: '#ffffff' }}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div>
            <Title order={2} size="h3" fw={600} c="var(--text-strong)">
              Skill Performance Analytics
            </Title>
            <Text size="sm" c="var(--text-muted)">
              Average scores by skill category · {candidates.length} candidates analyzed
            </Text>
          </div>
          
          <Box 
            p="sm" 
            style={{ 
              border: '1px solid var(--surface-border)',
              borderRadius: '6px',
              background: '#f9fafb'
            }}
          >
            <Text size="xs" fw={600} mb={8} c="var(--text-muted)">
              METRIC LEGEND
            </Text>
            <Stack gap={6}>
              <Group gap={8}>
                <div style={{ 
                  width: 10, 
                  height: 10, 
                  backgroundColor: '#d9534f', 
                  borderRadius: 2 
                }} />
                <Text size="xs" c="var(--text-muted)">Crisis Management</Text>
              </Group>
              <Group gap={8}>
                <div style={{ 
                  width: 10, 
                  height: 10, 
                  backgroundColor: '#28a745', 
                  borderRadius: 2 
                }} />
                <Text size="xs" c="var(--text-muted)">Sustainability</Text>
              </Group>
              <Group gap={8}>
                <div style={{ 
                  width: 10, 
                  height: 10, 
                  backgroundColor: '#2b7be4', 
                  borderRadius: 2 
                }} />
                <Text size="xs" c="var(--text-muted)">Team Motivation</Text>
              </Group>
            </Stack>
          </Box>
        </Group>

        <Stack gap="xl" mt="md">
          {skillAverages.map(skill => (
            <div key={skill.skill}>
              <Group justify="space-between" mb={4}>
                <Text fw={600} size="md" c="var(--text-strong)">
                  {skill.skill}
                </Text>
                <Text size="xs" c="var(--text-muted)">
                  {skill.count} candidate{skill.count !== 1 ? 's' : ''} with this skill
                </Text>
              </Group>

              <div style={{ 
                width: '100%', 
                height: 36, 
                backgroundColor: '#e8eaed',
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--surface-border)'
              }}>
                <div style={{
                  width: `${skill.avgTotal}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-blue)',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  paddingRight: 12
                }}>
                  <Text size="sm" fw={600} c="white">
                    {formatScore(skill.avgTotal)}
                  </Text>
                </div>
              </div>

              <Group gap="sm" mt="xs">
                <Badge 
                  size="md" 
                  variant="light"
                  style={{ 
                    backgroundColor: 'rgba(217, 83, 79, 0.08)',
                    color: '#d9534f',
                    border: '1px solid rgba(217, 83, 79, 0.2)',
                    fontWeight: 500
                  }}
                >
                  Crisis: {formatScore(skill.avgCrisis)}
                </Badge>
                <Badge 
                  size="md" 
                  variant="light"
                  style={{ 
                    backgroundColor: 'rgba(40, 167, 69, 0.08)',
                    color: '#28a745',
                    border: '1px solid rgba(40, 167, 69, 0.2)',
                    fontWeight: 500
                  }}
                >
                  Sustainability: {formatScore(skill.avgSustainability)}
                </Badge>
                <Badge 
                  size="md" 
                  variant="light"
                  style={{ 
                    backgroundColor: 'rgba(43, 123, 228, 0.08)',
                    color: '#2b7be4',
                    border: '1px solid rgba(43, 123, 228, 0.2)',
                    fontWeight: 500
                  }}
                >
                  Team: {formatScore(skill.avgTeam)}
                </Badge>
              </Group>
            </div>
          ))}
        </Stack>

        <Box 
          p="md" 
          mt="md" 
          style={{ 
            border: '1px solid var(--surface-border)',
            borderRadius: '6px',
            background: '#f9fafb'
          }}
        >
          <Text fw={600} mb="md" c="var(--text-strong)">
            Overall Statistics
          </Text>
          <Group gap="xl">
            <div>
              <Text size="xs" c="var(--text-muted)" mb={4}>
                TOTAL CANDIDATES
              </Text>
              <Text fw={700} size="xl" c="var(--text-strong)">
                {candidates.length}
              </Text>
            </div>
            <div>
              <Text size="xs" c="var(--text-muted)" mb={4}>
                AVG TOTAL SCORE
              </Text>
              <Text fw={700} size="xl" c="var(--accent-blue)">
                {formatScore(candidates.reduce((sum, c) => sum + c.total_score, 0) / candidates.length)}
              </Text>
            </div>
            <div>
              <Text size="xs" c="var(--text-muted)" mb={4}>
                UNIQUE SKILLS
              </Text>
              <Text fw={700} size="xl" c="var(--text-strong)">
                {skillAverages.length}
              </Text>
            </div>
          </Group>
        </Box>
      </Stack>
    </Box>
  )
}

export default SkillHeatmap
