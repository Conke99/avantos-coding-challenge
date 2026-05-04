import type { DataSource, DataSourceContext, DataSourceItem } from './types'

export class DataSourceRegistry {
  private sources: DataSource[] = []

  register(source: DataSource): void {
    this.sources.push(source)
  }

  getAll(): DataSource[] {
    return this.sources
  }

  getAllItems(context: DataSourceContext): DataSourceItem[] {
    return this.sources.flatMap((source) => source.getItems(context))
  }
}

export const dataSourceRegistry = new DataSourceRegistry()
