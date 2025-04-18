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
  Typography,
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
    baseCost: "",
    printCost: "",
    packagingCost: "",
    shippingCost: "",
    laborCost: "",
    marginPercentage: "30", // Default margin is 30%
    providerId: "",
    categoryId: "",
  });

  React.useEffect(() => {
    if (productId && products) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        // For existing products, use the stored pricing components
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description || "",
          baseCost: product.rawPrice.toString(),
          printCost: product.printCost ? product.printCost.toString() : "",
          packagingCost: product.packagingCost
            ? product.packagingCost.toString()
            : "",
          shippingCost: product.shippingCost
            ? product.shippingCost.toString()
            : "",
          laborCost: product.laborCost ? product.laborCost.toString() : "",
          marginPercentage: product.marginPercentage
            ? product.marginPercentage.toString()
            : "30",
          providerId: product.provider.id.toString(),
          categoryId: product.category.id.toString(),
        });
      }
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        baseCost: "",
        printCost: "",
        packagingCost: "",
        shippingCost: "",
        laborCost: "",
        marginPercentage: "30", // Default margin
        providerId: "",
        categoryId: "",
      });
    }
  }, [productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      baseCost: parseFloat(formData.baseCost),
      printCost: formData.printCost
        ? parseFloat(formData.printCost)
        : undefined,
      packagingCost: formData.packagingCost
        ? parseFloat(formData.packagingCost)
        : undefined,
      shippingCost: formData.shippingCost
        ? parseFloat(formData.shippingCost)
        : undefined,
      laborCost: formData.laborCost
        ? parseFloat(formData.laborCost)
        : undefined,
      marginPercentage: parseInt(formData.marginPercentage),
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
            {/* Pricing Section */}
            <Box
              sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 1, mt: 2 }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Componentes de Preço
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Custo Base (Fornecedor)"
                  type="number"
                  value={formData.baseCost}
                  onChange={(e) =>
                    setFormData({ ...formData, baseCost: e.target.value })
                  }
                  required
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Custo de Impressão"
                  type="number"
                  value={formData.printCost}
                  onChange={(e) =>
                    setFormData({ ...formData, printCost: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Custo de Embalagem"
                  type="number"
                  value={formData.packagingCost}
                  onChange={(e) =>
                    setFormData({ ...formData, packagingCost: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Custo de Envio"
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingCost: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Custo de Mão de Obra"
                  type="number"
                  value={formData.laborCost}
                  onChange={(e) =>
                    setFormData({ ...formData, laborCost: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Margem (%)"
                  type="number"
                  value={formData.marginPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marginPercentage: e.target.value,
                    })
                  }
                  required
                  fullWidth
                  inputProps={{ min: 0, max: 100, step: 1 }}
                />
              </Box>
            </Box>
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
