import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useProviders } from "../hooks/useProviders";

interface ProviderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  providerId: number | null;
}

export function ProviderForm({
  open,
  onClose,
  onSubmit,
  providerId,
}: ProviderFormProps) {
  const { providers, createProvider, updateProvider } = useProviders();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  React.useEffect(() => {
    if (providerId && providers) {
      const provider = providers.find((p) => p.id === providerId);
      if (provider) {
        setFormData({
          name: provider.name,
          email: provider.email,
          phone: provider.phone,
          address: provider.address,
        });
      }
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [providerId, providers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (providerId) {
      await updateProvider({ id: providerId, data: formData });
    } else {
      await createProvider(formData);
    }
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {providerId ? "Editar Fornecedor" : "Adicionar Fornecedor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Telefone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Endereço"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {providerId ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
