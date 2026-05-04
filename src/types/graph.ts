export type InputMapping = Record<string, string>

export interface FieldSchemaProperty {
  avantos_type: string
  title: string
  type: string
  format?: string
}

export interface FieldSchema {
  type: string
  properties: Record<string, FieldSchemaProperty>
  required: string[]
}

export interface FormDefinition {
  id: string
  name: string
  description: string
  is_reusable: boolean
  field_schema: FieldSchema
}

export interface GraphNodeData {
  id: string
  component_key: string
  component_type: string
  component_id: string
  name: string
  prerequisites: string[]
  input_mapping: InputMapping
}

export interface GraphNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: GraphNodeData
}

export interface GraphEdge {
  source: string
  target: string
}

export interface BlueprintGraph {
  id: string
  tenant_id: string
  name: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  forms: FormDefinition[]
}
