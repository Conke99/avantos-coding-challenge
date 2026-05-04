import { dataSourceRegistry } from './registry'
import { formFieldsSource } from './formFieldsSource'
import { globalPropertiesSource } from './globalPropertiesSource'

dataSourceRegistry.register(formFieldsSource)
dataSourceRegistry.register(globalPropertiesSource)

export { dataSourceRegistry }
export * from './types'
