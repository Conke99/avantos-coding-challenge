import type { GraphNode } from "../types/graph";

export function getNodeById(
  nodeId: string,
  allNodes: GraphNode[],
): GraphNode | undefined {
  return allNodes.find((n) => n.id === nodeId);
}

export function getAncestorNodes(
  nodeId: string,
  allNodes: GraphNode[],
  param: string | null,
): GraphNode[] {
  if (param === "transitive") return [];

  const node = getNodeById(nodeId, allNodes);
  if (!node) return [];

  if (param === "direct") {
    return node.data.prerequisites
      .map((prereqId) => getNodeById(prereqId, allNodes))
      .filter((n): n is GraphNode => n !== undefined);
  }

  // "global" or null/default: walk entire ancestry
  const visited = new Set<string>();
  const ancestors: GraphNode[] = [];

  function walk(id: string) {
    const current = getNodeById(id, allNodes);
    if (!current) return;
    for (const prereqId of current.data.prerequisites) {
      if (visited.has(prereqId)) continue;
      visited.add(prereqId);
      const prereqNode = getNodeById(prereqId, allNodes);
      if (prereqNode) {
        ancestors.push(prereqNode);
        walk(prereqId);
      }
    }
  }

  walk(nodeId);
  return ancestors;
}
