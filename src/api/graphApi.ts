import axios from 'axios'
import type { BlueprintGraph } from '../types/graph'

const client = axios.create({ baseURL: 'http://localhost:3000' })

export const DEFAULT_TENANT_ID = '1'
export const DEFAULT_BLUEPRINT_ID = 'bp_01jk766tckfwx84xjcxazggzyc'

export async function fetchBlueprintGraph(
  tenantId: string,
  blueprintId: string,
): Promise<BlueprintGraph> {
  const { data } = await client.get<BlueprintGraph>(
    `/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`,
  )
  return data
}
