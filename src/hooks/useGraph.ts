import { useState, useEffect } from 'react'
import { fetchBlueprintGraph, DEFAULT_TENANT_ID, DEFAULT_BLUEPRINT_ID } from '../api/graphApi'
import type { BlueprintGraph } from '../types/graph'

export function useGraph() {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlueprintGraph(DEFAULT_TENANT_ID, DEFAULT_BLUEPRINT_ID)
      .then(setGraph)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function updateNodeMapping(nodeId: string, fieldKey: string, value: string | null) {
    setGraph((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        nodes: prev.nodes.map((node) => {
          if (node.id !== nodeId) return node
          const mapping = { ...node.data.input_mapping }
          if (value === null) {
            delete mapping[fieldKey]
          } else {
            mapping[fieldKey] = value
          }
          return { ...node, data: { ...node.data, input_mapping: mapping } }
        }),
      }
    })
  }

  return { graph, loading, error, updateNodeMapping }
}
