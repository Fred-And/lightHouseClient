import React from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
import { OrderFormData, OrderItem } from "../hooks/useOrders";

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => Promise<void>;
  initialData?: OrderFormData | null;
}

export function OrderForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: OrderFormProps) {
  const { customers } = useCustomers();
  const { products } = useProducts();
  const [formData, setFormData] = React.useState<OrderFormData>({
    customerId: 0,
    orderNumber: "",
    productionStatus: "received",
    orderDate: new Date().toISOString(),
    description: "",
    items: [],
  });
  const [currentItem, setCurrentItem] = React.useState<Partial<OrderItem>>({
    productId: 0,
    printId: undefined,
    quantity: 1,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "orderDate") {
      const date = new Date(value);
      date.setHours(12);
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStatusChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      productionStatus: e.target.value,
    }));
  };

  const handleCustomerChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      customerId: e.target.value,
    }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleProductChange = (e: any) => {
    const productId = e.target.value;
    const product = products?.find((p) => p.id === productId);
    // const print = currentItem.printId
    //   ? products?.find((p) => p.id === currentItem.printId)
    //   : null;

    setCurrentItem((prev) => ({
      ...prev,
      productId,
      unitPrice: product?.totalPrice || 0,
      total: calculateItemTotal(prev.quantity || 1, product?.totalPrice || 0),
    }));
  };

  // const handlePrintChange = (e: any) => {
  //   const printId = e.target.value || undefined;
  //   const print = printId ? products?.find((p) => p.id === printId) : null;
  //   const product = products?.find((p) => p.id === currentItem.productId);

  //   setCurrentItem((prev) => ({
  //     ...prev,
  //     printId,
  //     total: calculateItemTotal(
  //       prev.quantity || 1,
  //       product?.totalPrice || 0,
  //       print?.totalPrice || 0
  //     ),
  //   }));
  // };

  const calculateItemTotal = (quantity: number, productPrice: number) => {
    return productPrice * quantity;
  };

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity) return;

    const product = products?.find((p) => p.id === currentItem.productId);
    const print = currentItem.printId
      ? products?.find((p) => p.id === currentItem.printId)
      : null;

    const newItem: OrderItem = {
      id: Math.floor(Math.random() * -1000000), // Temporary negative ID to avoid conflicts with real IDs
      productId: currentItem.productId,
      printId: currentItem.printId || 0,
      quantity: currentItem.quantity,
      productUnitPrice: product?.totalPrice || 0,
      printUnitPrice: print?.totalPrice || 0,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem({
      productId: 0,
      printId: undefined,
      quantity: 1,
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // const prints = products?.filter((p) => p.category.name === "Estampa");
  const regularProducts = products?.filter(
    (p) => p.category.name === "Produto"
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Editar Pedido" : "Criar Pedido"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                  label="Cliente"
                  required
                >
                  {customers?.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número do Pedido"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.productionStatus}
                  onChange={handleStatusChange}
                  label="Status"
                  required
                >
                  <MenuItem value="received">Recebido</MenuItem>
                  <MenuItem value="started">Iniciado</MenuItem>
                  <MenuItem value="in_progress">Em Produção</MenuItem>
                  <MenuItem value="done">Concluído</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data do Pedido"
                name="orderDate"
                type="date"
                value={formData.orderDate.split("T")[0]}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Adicionar Item
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      value={currentItem.productId || ""}
                      onChange={handleProductChange}
                      label="Produto"
                    >
                      {regularProducts?.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Impressão</InputLabel>
                    <Select
                      value={currentItem.printId || ""}
                      onChange={handlePrintChange}
                      label="Impressão"
                    >
                      <MenuItem value="">Nenhuma</MenuItem>
                      {prints?.map((print) => (
                        <MenuItem key={print.id} value={print.id}>
                          {print.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>7
                </Grid> */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    name="quantity"
                    type="number"
                    value={currentItem.quantity || ""}
                    onChange={handleItemChange}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={addItem}
                    fullWidth
                    sx={{ height: "56px" }}
                    disabled={!currentItem.productId || !currentItem.quantity}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Itens do Pedido
              </Typography>
              {formData.items.map((item, index) => {
                const product = products?.find((p) => p.id === item.productId);
                const print = item.printId
                  ? products?.find((p) => p.id === item.printId)
                  : null;

                return (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs>
                          <Typography variant="subtitle1">
                            {product?.name}
                            {print && ` + ${print.name}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantidade: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: €{" "}
                            {calculateItemTotal(
                              item.quantity,
                              item.productUnitPrice
                            ).toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => removeItem(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {initialData ? "Atualizar Pedido" : "Criar Pedido"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
}
