import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { OrdersList } from "../components/OrdersList";
import { useOrders, OrderFormData, Order } from "../hooks/useOrders";
import { OrderForm } from "../components/OrderForm";

export function OrdersPage() {
  const { orders, isLoading, deleteOrder, createOrder } = useOrders();
  const [isOrderFormOpen, setIsOrderFormOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<OrderFormData | null>(
    null
  );

  const handleEdit = (order: Order) => {
    setEditingOrder({
      customerId: order.customerId,
      orderNumber: order.orderNumber,
      productionStatus: order.productionStatus || "received",
      description: order.description,
      orderDate: order.orderDate || new Date().toISOString(),
      items:
        order.orderItems?.map((item) => ({
          id: item.id,
          productId: item.productId,
          printId: item.printId,
          quantity: item.quantity,
          productUnitPrice: item.unitPrice,
          printUnitPrice: 0, // Since this is not in GetOrderItem, defaulting to 0
          product: item.product,
          print: item.print,
        })) || [],
    });
    setIsOrderFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      await deleteOrder.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: OrderFormData) => {
    try {
      await createOrder.mutateAsync(data);
      setIsOrderFormOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Pedidos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingOrder(null);
            setIsOrderFormOpen(true);
          }}
        >
          Novo Pedido
        </Button>
      </Box>

      <OrdersList
        orders={orders || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={isOrderFormOpen}
        onClose={() => {
          setIsOrderFormOpen(false);
          setEditingOrder(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingOrder ? "Editar Pedido" : "Novo Pedido"}
        </DialogTitle>
        <DialogContent>
          <OrderForm
            open={isOrderFormOpen}
            onClose={() => setIsOrderFormOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingOrder}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
