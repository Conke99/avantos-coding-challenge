import type { GraphNode } from '../types/graph'

export function getNodeById(nodeId: string, allNodes: GraphNode[]): GraphNode | undefined {
  return allNodes.find((n) => n.id === nodeId)
}

export function getAncestorNodes(nodeId: string, allNodes: GraphNode[]): GraphNode[] {
  const visited = new Set<string>()
  const ancestors: GraphNode[] = []

  function walk(id: string) {
    const node = getNodeById(id, allNodes)
    if (!node) return
    for (const prereqId of node.data.prerequisites) {
      if (visited.has(prereqId)) continue
      visited.add(prereqId)
      const prereqNode = getNodeById(prereqId, allNodes)
      if (prereqNode) {
        ancestors.push(prereqNode)
        walk(prereqId)
      }
    }
  }

  walk(nodeId)
  return ancestors
}
