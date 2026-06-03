import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DataSourceModal from "../DataSourceModal/DataSourceModal";
import type { GraphNode, FormDefinition } from "../../types/graph";

interface Props {
  node: GraphNode;
  allNodes: GraphNode[];
  allForms: FormDefinition[];
  onUpdateMapping: (
    nodeId: string,
    fieldKey: string,
    value: string | null,
  ) => void;
}

export default function PrefillPanel({
  node,
  allNodes,
  allForms,
  onUpdateMapping,
}: Props) {
  const [prefillEnabled, setPrefillEnabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  const form = allForms.find((f) => f.id === node.data.component_id);

  if (!form) {
    return <Typography>Form definition not found</Typography>;
  }

  const fieldKeys = Object.keys(form.field_schema.properties);

  function openModal(fieldKey: string) {
    setActiveFieldKey(fieldKey);
    setModalOpen(true);
  }

  return (
    <Box>
      <Typography variant="h6">{node.data.name}</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={prefillEnabled}
            onChange={(e) => setPrefillEnabled(e.target.checked)}
          />
        }
        label="Prefill fields for this form"
      />
      {prefillEnabled && (
        <List>
          {fieldKeys.map((fieldKey) => {
            const mappedValue = node.data.input_mapping[fieldKey];
            if (mappedValue) {
              return (
                <ListItem key={fieldKey}>
                  <ListItemText primary={fieldKey} />
                  <ListItemSecondaryAction>
                    <Chip label={mappedValue} />
                    <IconButton
                      edge="end"
                      onClick={() => onUpdateMapping(node.id, fieldKey, null)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            }
            return (
              <ListItemButton
                key={fieldKey}
                onClick={() => openModal(fieldKey)}
              >
                <ListItemText primary={fieldKey} />
              </ListItemButton>
            );
          })}
        </List>
      )}
      <DataSourceModal
        key={activeFieldKey ?? ""}
        open={modalOpen}
        fieldKey={activeFieldKey ?? ""}
        nodeId={node.id}
        allNodes={allNodes}
        allForms={allForms}
        onSelect={(value) => {
          onUpdateMapping(node.id, activeFieldKey!, value);
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
