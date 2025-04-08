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
import { useProducts } from "../hooks/useProducts";
import { useProviders } from "../hooks/useProviders";
import { useCategories } from "../hooks/useCategories";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  productId: number | null;
}

export function ProductForm({
  open,
  onClose,
  onSubmit,
  productId,
}: ProductFormProps) {
  const { products, createProduct, updateProduct } = useProducts();
  const { providers } = useProviders();
  const { categories } = useCategories();
  const [formData, setFormData] = React.useState({
    name: "",
    sku: "",
    description: "",
    rawPrice: "",
    providerId: "",
    categoryId: "",
  });

  React.useEffect(() => {
    if (productId && products) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description,
          rawPrice: product.rawPrice.toString(),
          providerId: product.provider.id.toString(),
          categoryId: product.category.id.toString(),
        });
      }
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        rawPrice: "",
        providerId: "",
        categoryId: "",
      });
    }
  }, [productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      rawPrice: parseFloat(formData.rawPrice),
      providerId: parseInt(formData.providerId),
      categoryId: parseInt(formData.categoryId),
    };

    if (productId) {
      await updateProduct({ id: productId, data });
    } else {
      await createProduct(data);
    }
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {productId ? "Editar Produto" : "Adicionar Produto"}
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
              label="SKU"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth required>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={formData.providerId}
                label="Fornecedor"
                onChange={(e) =>
                  setFormData({ ...formData, providerId: e.target.value })
                }
              >
                {providers?.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.categoryId}
                label="Categoria"
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Preço Base"
              type="number"
              value={formData.rawPrice}
              onChange={(e) =>
                setFormData({ ...formData, rawPrice: e.target.value })
              }
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {productId ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
