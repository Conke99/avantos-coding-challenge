import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { dataSourceRegistry } from "../../dataSources";
import type { DataSourceItem } from "../../dataSources/types";
import type { GraphNode, FormDefinition } from "../../types/graph";

interface Props {
  open: boolean;
  fieldKey: string;
  nodeId: string;
  allNodes: GraphNode[];
  allForms: FormDefinition[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function DataSourceModal({
  open,
  fieldKey,
  nodeId,
  allNodes,
  allForms,
  onSelect,
  onClose,
}: Props) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams(window.location.search);

  const urlQueryParam = queryParams.get("q");

  const allItems: DataSourceItem[] = dataSourceRegistry.getAllItems({
    nodeId,
    allNodes,
    allForms,
    param: urlQueryParam,
  });

  const filtered = allItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.groupLabel.toLowerCase().includes(q)
    );
  });

  const groups = new Map<string, DataSourceItem[]>();
  for (const item of filtered) {
    const bucket = groups.get(item.groupLabel) ?? [];
    bucket.push(item);
    groups.set(item.groupLabel, bucket);
  }

  function toggleGroup(groupLabel: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupLabel)) {
        next.delete(groupLabel);
      } else {
        next.add(groupLabel);
      }
      return next;
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select data element to map</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Field: {fieldKey}
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <List disablePadding>
          {Array.from(groups.entries()).map(([groupLabel, items]) => (
            <Box key={groupLabel}>
              <ListItemButton onClick={() => toggleGroup(groupLabel)}>
                <ListItemText primary={groupLabel} />
                {expandedGroups.has(groupLabel) ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
              <Collapse in={expandedGroups.has(groupLabel)} unmountOnExit>
                <List disablePadding>
                  {items.map((item) => (
                    <ListItemButton
                      key={item.value}
                      selected={item.value === selectedValue}
                      onClick={() => setSelectedValue(item.value)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button
          variant="contained"
          disabled={selectedValue === null}
          onClick={() => {
            if (selectedValue !== null) {
              onSelect(selectedValue);
              onClose();
            }
          }}
        >
          SELECT
        </Button>
      </DialogActions>
    </Dialog>
  );
}
