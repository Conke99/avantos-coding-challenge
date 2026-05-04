import { describe, it, expect } from 'vitest'
import { getAncestorNodes } from './dagUtils'
import type { GraphNode } from '../types/graph'

function makeNode(id: string, prerequisites: string[]): GraphNode {
  return {
    id,
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id,
      component_key: id,
      component_type: 'form',
      component_id: id,
      name: id,
      prerequisites,
      input_mapping: {},
    },
  }
}

const formA = makeNode('form-a', [])
const formB = makeNode('form-b', ['form-a'])
const formC = makeNode('form-c', ['form-a'])
const formD = makeNode('form-d', ['form-b'])
const formE = makeNode('form-e', ['form-c'])
const formF = makeNode('form-f', ['form-d', 'form-e'])

const allNodes: GraphNode[] = [formA, formB, formC, formD, formE, formF]

describe('getAncestorNodes', () => {
  it('returns empty array for a node with no prerequisites', () => {
    expect(getAncestorNodes('form-a', allNodes)).toEqual([])
  })

  it('returns direct parent only for a node with one parent', () => {
    const result = getAncestorNodes('form-b', allNodes)
    expect(result).toEqual([formA])
  })

  it('returns direct parent and transitive ancestor', () => {
    const result = getAncestorNodes('form-d', allNodes)
    expect(result).toEqual(expect.arrayContaining([formB, formA]))
    expect(result).toHaveLength(2)
  })

  it('returns all ancestors for Form F', () => {
    const result = getAncestorNodes('form-f', allNodes)
    expect(result).toEqual(expect.arrayContaining([formD, formE, formB, formC, formA]))
    expect(result).toHaveLength(5)
  })

  it('does not include the node itself', () => {
    const result = getAncestorNodes('form-d', allNodes)
    const ids = result.map((n) => n.id)
    expect(ids).not.toContain('form-d')
  })

  it('returns empty array for unknown nodeId', () => {
    expect(getAncestorNodes('does-not-exist', allNodes)).toEqual([])
  })
})
