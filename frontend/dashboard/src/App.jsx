import { useState } from 'react'
import { Container, Title, Text, Tabs, Stack, Group, Box, Button } from '@mantine/core'
import { IconTrophy, IconUser, IconChartBar, IconRefresh, IconDownload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import Leaderboard from './components/Leaderboard'
import CandidateCard from './components/CandidateCard'
import SkillHeatmap from './components/SkillHeatmap'
import { loadCandidates, computeRankings, saveCandidates, clearCache } from './lib/dataLoader'
import { generateAllCandidates, generateSQL, downloadFile } from './lib/dataGenerator'

function App() {
  const [candidatesData, setCandidatesData] = useState(computeRankings(loadCandidates()))
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [generating, setGenerating] = useState(false)

  const handleRegenerateData = (downloadFiles = false) => {
    setGenerating(true)
    
    setTimeout(() => {
      try {
        const newCandidates = generateAllCandidates(40)
        
        saveCandidates(newCandidates)
        
        clearCache()
        const rankedData = computeRankings(newCandidates)
        setCandidatesData(rankedData)
        
        if (downloadFiles) {
          const sqlContent = generateSQL(newCandidates)
          const jsonContent = JSON.stringify(newCandidates, null, 2)
          
          downloadFile(sqlContent, 'seed.sql', 'text/plain')
          downloadFile(jsonContent, 'candidates.json', 'application/json')
          
          notifications.show({
            title: 'Data Regenerated!',
            message: `Generated ${newCandidates.length} new candidates. Dashboard updated and files downloaded.`,
            color: 'green',
            autoClose: 5000
          })
        } else {
          notifications.show({
            title: 'Data Regenerated!',
            message: `Generated ${newCandidates.length} new candidates with fresh scores. Dashboard updated instantly.`,
            color: 'green',
            autoClose: 4000
          })
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to generate data: ' + error.message,
          color: 'red'
        })
      } finally {
        setGenerating(false)
      }
    }, 300)
  }

  return (
    <Container size="xl" py="lg" style={{ background: '#ffffff' }}>
      <Stack gap="lg">
        <Box 
          p="md" 
          style={{ 
            borderBottom: '1px solid var(--surface-border)',
            background: '#ffffff'
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <div style={{ flex: 1 }}>
              <Title 
                order={1} 
                fw={700} 
                size={36}
                c="var(--text-strong)"
                mb={8}
              >
                EcoRank
              </Title>
              <Text size="sm" c="var(--text-muted)" mb="md">
                AI-powered evaluation dashboard for recycling production line manager candidates
              </Text>
              
              <Group gap="lg">
                <div className="legend-item">
                  <div className="legend-dot legend-dot-crisis" />
                  <span>Crisis Management</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-dot-sustainability" />
                  <span>Sustainability</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-dot-team" />
                  <span>Team Motivation</span>
                </div>
              </Group>
            </div>
            
            <Group gap="xs">
              <Button 
                leftSection={<IconRefresh size={16} />}
                onClick={() => handleRegenerateData(false)}
                loading={generating}
                variant="light"
                color="blue"
                size="sm"
              >
                Regenerate Data
              </Button>
              <Button 
                leftSection={<IconDownload size={16} />}
                onClick={() => handleRegenerateData(true)}
                loading={generating}
                variant="outline"
                color="gray"
                size="sm"
              >
                + Download Files
              </Button>
            </Group>
          </Group>
          
          {import.meta.env.DEV && (
            <Text size="xs" c="var(--text-muted)" mt="sm" style={{ fontFamily: 'monospace' }}>
              💡 "Regenerate Data" updates dashboard instantly. Use "+ Download Files" to also save seed.sql & candidates.json
            </Text>
          )}
        </Box>

        <Tabs defaultValue="leaderboard">
          <Tabs.List style={{ 
            borderBottom: '1px solid var(--surface-border)',
            marginBottom: '20px'
          }}>
            <Tabs.Tab value="leaderboard" leftSection={<IconTrophy size={16} />}>
              Leaderboard
            </Tabs.Tab>
            <Tabs.Tab value="candidates" leftSection={<IconUser size={16} />}>
              All Candidates
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="leaderboard" pt="md">
            <Leaderboard 
              candidates={candidatesData} 
              onSelectCandidate={setSelectedCandidate}
            />
          </Tabs.Panel>

          <Tabs.Panel value="candidates" pt="md">
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Showing all {candidatesData.length} candidates
              </Text>
              {candidatesData.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate}
                  compact={false}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <SkillHeatmap candidates={candidatesData} />
          </Tabs.Panel>
        </Tabs>

        {selectedCandidate && (
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Selected Candidate</Title>
            <CandidateCard candidate={selectedCandidate} compact={false} />
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default App
