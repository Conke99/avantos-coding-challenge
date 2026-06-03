export interface DataSourceItem {
  value: string
  label: string
  groupLabel: string
}

export interface DataSourceContext {
  nodeId: string
  allNodes: import('../types/graph').GraphNode[]
  allForms: import('../types/graph').FormDefinition[]
  param: string | null
}

export interface DataSource {
  id: string
  getLabel(): string
  getItems(context: DataSourceContext): DataSourceItem[]
}
