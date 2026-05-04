import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ArticleIcon from '@mui/icons-material/Article'
import type { GraphNode } from '../../types/graph'

interface Props {
  nodes: GraphNode[]
  selectedNodeId: string | null
  onSelect: (nodeId: string) => void
}

export default function FormList({ nodes, selectedNodeId, onSelect }: Props) {
  return (
    <Box>
      <Typography variant="subtitle2">Forms</Typography>
      <List>
        {nodes.map((node) => (
          <ListItemButton
            key={node.id}
            selected={node.id === selectedNodeId}
            onClick={() => onSelect(node.id)}
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary={node.data.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
