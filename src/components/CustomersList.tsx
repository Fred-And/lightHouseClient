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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CustomerForm } from "./CustomerForm";
import { useCustomers } from "../hooks/useCustomers";

export function CustomersList() {
  const { customers, isLoading, createCustomer } = useCustomers();
  const [isCustomerFormOpen, setIsCustomerFormOpen] = React.useState(false);
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up("sm"));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Clientes</Typography>
        <Button
          variant="contained"
          startIcon={isSmallUp ? <AddIcon /> : undefined}
          onClick={() => setIsCustomerFormOpen(true)}
          sx={{
            minWidth: { xs: "48px", sm: "auto" },
            "& .MuiButton-startIcon": {
              margin: isSmallUp ? "auto" : 0,
            },
          }}
        >
          {!isSmallUp ? <AddIcon /> : "Adicionar Cliente"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              {isSmallUp && (
                <>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Endereço</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                {isSmallUp && (
                  <>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomerForm
        open={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSubmit={async (data) => {
          await createCustomer(data);
          setIsCustomerFormOpen(false);
        }}
      />
    </Box>
  );
}
