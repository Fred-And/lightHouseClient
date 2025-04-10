import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useExpenses } from "../hooks/useExpenses";
import { ExpenseForm } from "./ExpenseForm";

type SortOrder = "asc" | "desc";

export function ExpensesList() {
  const { expenses, isLoading } = useExpenses();
  const [isExpenseFormOpen, setIsExpenseFormOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up("sm"));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredExpenses = expenses?.filter((expense) => {
    if (selectedType === "all") return true;
    return expense.movementType.toLowerCase() === selectedType.toLowerCase();
  });

  const sortedExpenses = [...(filteredExpenses || [])].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const getMovementTypeDot = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return (
          <Tooltip title="Receita">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "success.main",
                display: "inline-block",
              }}
            />
          </Tooltip>
        );
      case "expense":
        return (
          <Tooltip title="Despesa">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "inline-block",
              }}
            />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Movimentos</Typography>
        <Button
          variant="contained"
          startIcon={isSmallUp ? <AddIcon /> : undefined}
          onClick={() => setIsExpenseFormOpen(true)}
          sx={{
            minWidth: { xs: "48px", sm: "auto" },
            "& .MuiButton-startIcon": {
              margin: isSmallUp ? "auto" : 0,
            },
          }}
        >
          {!isSmallUp ? <AddIcon /> : "Adicionar Movimento"}
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Tipo</InputLabel>
          <Select
            value={selectedType}
            label="Filtrar por Tipo"
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="income">Receitas</MenuItem>
            <MenuItem value="expense">Despesas</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Data
                  <IconButton
                    size="small"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell align="right">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell align="center">
                  {getMovementTypeDot(expense.movementType)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      expense.movementType.toLowerCase() === "income"
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  € {Number(expense.rawValue).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ExpenseForm
        open={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onSubmit={async (data) => {
          // Handle expense creation
          setIsExpenseFormOpen(false);
        }}
      />
    </Box>
  );
}
