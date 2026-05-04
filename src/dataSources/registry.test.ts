import { describe, it, expect, vi } from 'vitest'
import { DataSourceRegistry } from './registry'
import type { DataSource, DataSourceContext, DataSourceItem } from './types'

function makeItem(value: string): DataSourceItem {
  return { value, label: value, groupLabel: 'Group' }
}

function makeSource(id: string, items: DataSourceItem[]): DataSource {
  return {
    id,
    getLabel: () => id,
    getItems: vi.fn().mockReturnValue(items),
  }
}

const mockContext: DataSourceContext = {
  nodeId: 'node-1',
  allNodes: [],
  allForms: [],
}

describe('DataSourceRegistry', () => {
  it('starts with no sources registered', () => {
    const registry = new DataSourceRegistry()
    expect(registry.getAll()).toEqual([])
  })

  it('registers a source and returns it', () => {
    const registry = new DataSourceRegistry()
    const source = makeSource('source-a', [])
    registry.register(source)
    expect(registry.getAll()).toHaveLength(1)
    expect(registry.getAll()[0]).toBe(source)
  })

  it('getAllItems calls getItems on all sources and flattens results', () => {
    const registry = new DataSourceRegistry()
    registry.register(makeSource('source-a', [makeItem('a1'), makeItem('a2')]))
    registry.register(makeSource('source-b', [makeItem('b1'), makeItem('b2')]))
    const items = registry.getAllItems(mockContext)
    expect(items).toHaveLength(4)
    expect(items.map((i) => i.value)).toEqual(['a1', 'a2', 'b1', 'b2'])
  })

  it('getAllItems passes context to each source', () => {
    const registry = new DataSourceRegistry()
    const source = makeSource('source-a', [])
    registry.register(source)
    registry.getAllItems(mockContext)
    expect(source.getItems).toHaveBeenCalledWith(mockContext)
  })

  it('registering a new source does not affect existing sources', () => {
    const registry = new DataSourceRegistry()
    const sourceA = makeSource('source-a', [makeItem('a1')])
    registry.register(sourceA)
    const itemsBefore = registry.getAllItems(mockContext)

    const sourceB = makeSource('source-b', [makeItem('b1')])
    registry.register(sourceB)
    const itemsAfter = registry.getAllItems(mockContext)

    expect(itemsBefore).toHaveLength(1)
    expect(itemsAfter).toHaveLength(2)
    expect(sourceA.getItems).toHaveBeenCalledTimes(2)
  })
})
