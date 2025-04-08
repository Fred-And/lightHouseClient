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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useProviders } from "../hooks/useProviders";
import { ProviderForm } from "./ProviderForm";

export function ProvidersList() {
  const { providers, isLoading, deleteProvider } = useProviders();
  const [isProviderFormOpen, setIsProviderFormOpen] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<number | null>(
    null
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (providerId: number) => {
    setSelectedProvider(providerId);
    setIsProviderFormOpen(true);
  };

  const handleDelete = async (providerId: number) => {
    if (window.confirm("Are you sure you want to delete this provider?")) {
      await deleteProvider(providerId);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Fornecedores</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProvider(null);
            setIsProviderFormOpen(true);
          }}
        >
          Adicionar Fornecedor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>NIF</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers?.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{provider.phone}</TableCell>
                <TableCell>{provider.address}</TableCell>
                <TableCell>{provider.taxId}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(provider.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(provider.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProviderForm
        open={isProviderFormOpen}
        onClose={() => {
          setIsProviderFormOpen(false);
          setSelectedProvider(null);
        }}
        onSubmit={async (data) => {
          setIsProviderFormOpen(false);
          setSelectedProvider(null);
        }}
        providerId={selectedProvider}
      />
    </Box>
  );
}
