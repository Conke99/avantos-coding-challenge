import { useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { useGraph } from './hooks/useGraph'
import FormList from './components/FormList/FormList'
import PrefillPanel from './components/PrefillPanel/PrefillPanel'

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const { graph, loading, error, updateNodeMapping } = useGraph()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  const selectedNode = graph?.nodes.find((n) => n.id === selectedNodeId) ?? null

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box
          sx={{
            width: 280,
            borderRight: '1px solid',
            borderColor: 'divider',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <FormList
            nodes={graph?.nodes ?? []}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
          />
        </Box>
        <Box sx={{ flex: 1, p: 3 }}>
          {selectedNode ? (
            <PrefillPanel
              key={selectedNodeId}
              node={selectedNode}
              allNodes={graph?.nodes ?? []}
              allForms={graph?.forms ?? []}
              onUpdateMapping={updateNodeMapping}
            />
          ) : (
            <Typography>Select a form to configure prefill</Typography>
          )}
        </Box>
      </Box>
    </>
  )
}
