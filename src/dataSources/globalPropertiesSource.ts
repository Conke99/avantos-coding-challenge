import type { DataSource, DataSourceItem } from './types'

const GLOBAL_FIELDS: { groupLabel: string; fields: string[] }[] = [
  { groupLabel: 'Action Properties', fields: ['action_id', 'action_name', 'created_at'] },
  { groupLabel: 'Client Organisation Properties', fields: ['org_id', 'org_name', 'org_email'] },
]

export const globalPropertiesSource: DataSource = {
  id: 'global-properties',

  getLabel() {
    return 'Global Properties'
  },

  getItems(): DataSourceItem[] {
    return GLOBAL_FIELDS.flatMap(({ groupLabel, fields }) =>
      fields.map((fieldKey) => ({
        value: `${groupLabel}.${fieldKey}`,
        label: fieldKey,
        groupLabel,
      })),
    )
  },
}
