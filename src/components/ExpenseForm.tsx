import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useExpenses } from "../hooks/useExpenses";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

type MovementType = "expense" | "income";

export function ExpenseForm({ open, onClose, onSubmit }: ExpenseFormProps) {
  const { createExpense } = useExpenses();
  const { mutate: createExpenseMutation } = createExpense;
  const [formData, setFormData] = React.useState({
    description: "",
    rawValue: "",
    movementType: "expense" as MovementType,
    date: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      rawValue: parseFloat(formData.rawValue),
      date: new Date(formData.date).toISOString(),
    };
    createExpenseMutation(data);
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar Movimento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Valor"
              type="number"
              value={formData.rawValue}
              onChange={(e) =>
                setFormData({ ...formData, rawValue: e.target.value })
              }
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth required>
              <InputLabel>Tipo de Movimento</InputLabel>
              <Select
                value={formData.movementType}
                label="Tipo de Movimento"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    movementType: e.target.value as MovementType,
                  })
                }
              >
                <MenuItem value="income">Receita</MenuItem>
                <MenuItem value="expense">Despesa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Data"
              type="datetime-local"
              value={formData.date.slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
