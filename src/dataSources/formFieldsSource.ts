import type { DataSource, DataSourceContext, DataSourceItem } from "./types";
import { getAncestorNodes } from "../utils/dagUtils";

export const formFieldsSource: DataSource = {
  id: "form-fields",

  getLabel() {
    return "Form Fields";
  },

  getItems(context: DataSourceContext): DataSourceItem[] {
    const ancestors = getAncestorNodes(
      context.nodeId,
      context.allNodes,
      context.param,
    );

    return ancestors.flatMap((node) => {
      const form = context.allForms.find(
        (f) => f.id === node.data.component_id,
      );
      if (!form) return [];
      return Object.keys(form.field_schema.properties).map((fieldKey) => ({
        value: `${node.data.name}.${fieldKey}`,
        label: fieldKey,
        groupLabel: node.data.name,
      }));
    });
  },
};
