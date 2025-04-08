import React from "react";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import { useExpenses } from "../hooks/useExpenses";
import { ExpenseForm } from "./ExpenseForm";
import { ProductForm } from "./ProductForm";
import { ProviderForm } from "./ProviderForm";
import { Layout } from "./Layout";

export function DashboardComponent() {
  const { balance } = useExpenses();
  const [isExpenseFormOpen, setIsExpenseFormOpen] = React.useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [isProviderFormOpen, setIsProviderFormOpen] = React.useState(false);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "success.light",
                color: "white",
              }}
            >
              <Typography variant="h6">Receitas</Typography>
              <Typography variant="h4">
                € {Number(balance.totalIncome).toFixed(2)}
              </Typography>
              <TrendingUpIcon sx={{ fontSize: 40, mt: 1 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "error.light",
                color: "white",
              }}
            >
              <Typography variant="h6">Despesas</Typography>
              <Typography variant="h4">
                € {Number(balance.totalExpenses).toFixed(2)}
              </Typography>
              <TrendingDownIcon sx={{ fontSize: 40, mt: 1 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: balance.balance >= 0 ? "success.main" : "error.main",
                color: "white",
              }}
            >
              <Typography variant="h6">Saldo</Typography>
              <Typography variant="h4">
                € {Number(balance.balance).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Ações Rápidas</Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsExpenseFormOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    Novo Movimento
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsProductFormOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    Novo Produto
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsProviderFormOpen(true)}
                  >
                    Novo Fornecedor
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <ExpenseForm
          open={isExpenseFormOpen}
          onClose={() => setIsExpenseFormOpen(false)}
          onSubmit={async (data) => {
            setIsExpenseFormOpen(false);
          }}
        />

        <ProductForm
          open={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          onSubmit={async (data) => {
            setIsProductFormOpen(false);
          }}
          productId={null}
        />

        <ProviderForm
          open={isProviderFormOpen}
          onClose={() => setIsProviderFormOpen(false)}
          onSubmit={async (data) => {
            setIsProviderFormOpen(false);
          }}
          providerId={null}
        />
      </Box>
    </Layout>
  );
}
