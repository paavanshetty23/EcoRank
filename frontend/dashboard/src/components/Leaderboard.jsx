import { useState, useMemo } from 'react'
import { Table, Box, Title, Text, TextInput, Group, Pagination, MultiSelect, Stack, Button, Tooltip } from '@mantine/core'
import { IconSearch, IconTrophy, IconFilter, IconX } from '@tabler/icons-react'
import { getAllSkills } from '../lib/dataLoader'
import { formatScore, getScoreTier, metricColors, formatYears } from '../lib/ui'
import { getCandidateAriaLabel, getSearchAriaLabel, getSkillFilterAriaLabel } from '../lib/a11y'

function Leaderboard({ candidates, onSelectCandidate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [sortBy, setSortBy] = useState('rank')
  const [sortOrder, setSortOrder] = useState('asc')
  const [activePage, setActivePage] = useState(1)
  const itemsPerPage = 10
  
  const skillOptions = useMemo(() => 
    getAllSkills(candidates).map(skill => ({ value: skill, label: skill }))
  , [candidates])
  
  const filteredCandidates = useMemo(() => {
    let result = [...candidates]
    
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedSkills.length > 0) {
      result = result.filter(c => 
        selectedSkills.some(skill => c.skills.includes(skill))
      )
    }
    
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'experience':
          comparison = a.years_experience - b.years_experience
          break
        case 'total_score':
          comparison = a.total_score - b.total_score
          break
        case 'rank':
        default:
          comparison = a.rank - b.rank
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return result
  }, [candidates, searchQuery, selectedSkills, sortBy, sortOrder])
  
  const paginatedCandidates = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage
    return filteredCandidates.slice(start, start + itemsPerPage)
  }, [filteredCandidates, activePage])
  
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }
  
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSkills([])
    setActivePage(1)
  }
  
  const hasActiveFilters = searchQuery || selectedSkills.length > 0

  const rows = paginatedCandidates.map((candidate) => {
    const rank = candidate.rank
    const tierInfo = getScoreTier(candidate.total_score)
    
    const getRankBadgeClass = (rank) => {
      if (rank === 1) return 'rank-badge rank-badge-1'
      if (rank === 2) return 'rank-badge rank-badge-2'
      if (rank === 3) return 'rank-badge rank-badge-3'
      return 'rank-badge rank-badge-other'
    }
    
    return (
      <Table.Tr 
        key={candidate.id}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelectCandidate && onSelectCandidate(candidate)}
        aria-label={getCandidateAriaLabel(candidate)}
      >
        <Table.Td>
          <div className={getRankBadgeClass(rank)}>
            {rank === 1 && '🏆'}
            {rank !== 1 && rank}
          </div>
        </Table.Td>
        
        <Table.Td>
          <Text fw={600} c="var(--text-strong)">{candidate.name}</Text>
        </Table.Td>
        
        <Table.Td>
          <Text size="sm" c="var(--text-muted)">{formatYears(candidate.years_experience)}</Text>
        </Table.Td>
        
        <Table.Td>
          <Tooltip label="Crisis Management capability">
            <div className="metric-badge metric-badge-crisis">
              {formatScore(candidate.crisis_management_score)}
            </div>
          </Tooltip>
        </Table.Td>
        
        <Table.Td>
          <Tooltip label="Sustainability leadership">
            <div className="metric-badge metric-badge-sustainability">
              {formatScore(candidate.sustainability_score)}
            </div>
          </Tooltip>
        </Table.Td>
        
        <Table.Td>
          <Tooltip label="Team motivation skills">
            <div className="metric-badge metric-badge-team">
              {formatScore(candidate.team_motivation_score)}
            </div>
          </Tooltip>
        </Table.Td>
        
        <Table.Td>
          <Text fw={700} size="lg" style={{ color: tierInfo.color }}>
            {formatScore(candidate.total_score)}
          </Text>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Box style={{ background: '#ffffff' }}>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={2} size="h3" fw={600} c="var(--text-strong)">
            Candidate Rankings
          </Title>
          <Text size="sm" c="var(--text-muted)">
            Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
            {filteredCandidates.length !== candidates.length && ` (${candidates.length} total)`}
          </Text>
        </div>
      </Group>
      
      <Group gap="md" mb="md" wrap="wrap">
        <TextInput
          placeholder="Search by name..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setActivePage(1)
          }}
          style={{ flex: 1, minWidth: 200 }}
          aria-label={getSearchAriaLabel(candidates.length)}
        />
        
        <MultiSelect
          placeholder="Filter by skills..."
          leftSection={<IconFilter size={16} />}
          data={skillOptions}
          value={selectedSkills}
          onChange={(value) => {
            setSelectedSkills(value)
            setActivePage(1)
          }}
          clearable
          searchable
          style={{ flex: 1, minWidth: 250 }}
          aria-label={getSkillFilterAriaLabel(skillOptions)}
        />
        
        {hasActiveFilters && (
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconX size={16} />}
            onClick={clearFilters}
            size="sm"
          >
            Clear filters
          </Button>
        )}
      </Group>
      
      <Box 
        style={{ 
          border: '1px solid var(--surface-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#ffffff'
        }}
      >
        <Table className="table-compact" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '60px' }}>Rank</Table.Th>
              <Table.Th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('name')}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Table.Th>
              <Table.Th
                style={{ cursor: 'pointer', width: '140px' }}
                onClick={() => handleSort('experience')}
              >
                Experience {sortBy === 'experience' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Table.Th>
              <Table.Th style={{ width: '110px' }}>Crisis</Table.Th>
              <Table.Th style={{ width: '130px' }}>Sustainability</Table.Th>
              <Table.Th style={{ width: '110px' }}>Team</Table.Th>
              <Table.Th
                style={{ cursor: 'pointer', width: '100px' }}
                onClick={() => handleSort('total_score')}
              >
                Total {sortBy === 'total_score' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
      
      {paginatedCandidates.length === 0 && (
        <Text ta="center" c="var(--text-muted)" py="xl">
          No candidates found matching your filters
        </Text>
      )}
      
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination 
            value={activePage} 
            onChange={setActivePage} 
            total={totalPages}
            size="sm"
            aria-label="Leaderboard pagination"
          />
        </Group>
      )}
    </Box>
  )
}

export default Leaderboard
