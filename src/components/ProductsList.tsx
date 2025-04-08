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
import { useProducts } from "../hooks/useProducts";
import { ProductForm } from "./ProductForm";

export function ProductsList() {
  const { products, isLoading, deleteProduct } = useProducts();
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<number | null>(
    null
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (productId: number) => {
    setSelectedProduct(productId);
    setIsProductFormOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProduct(null);
            setIsProductFormOpen(true);
          }}
        >
          Adicionar Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Preço Base</TableCell>
              <TableCell align="right">Preço Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.provider.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell align="right">
                  € {Number(product.rawPrice).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  € {Number(product.totalPrice).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product.id)}
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

      <ProductForm
        open={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={async (data) => {
          setIsProductFormOpen(false);
          setSelectedProduct(null);
        }}
        productId={selectedProduct}
      />
    </Box>
  );
}
