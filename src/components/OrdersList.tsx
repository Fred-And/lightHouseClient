import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Chip,
  Collapse,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Order } from "../hooks/useOrders";

interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "received":
      return "warning";
    case "started":
      return "info";
    case "in_progress":
      return "primary";
    case "done":
      return "success";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "received":
      return "Recebido";
    case "started":
      return "Iniciado";
    case "in_progress":
      return "Em Produção";
    case "done":
      return "Concluído";
    default:
      return status;
  }
};

function Row({
  order,
  onEdit,
  onDelete,
}: {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell>{order.customer?.name}</TableCell>
        <TableCell>
          <Chip
            label={getStatusLabel(order.productionStatus || "received")}
            color={getStatusColor(order.productionStatus || "received") as any}
            size="small"
          />
        </TableCell>
        <TableCell align="right">€ {order.totalCost || 0}</TableCell>
        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
        <TableCell align="center">
          <IconButton
            size="small"
            onClick={() => onEdit(order)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(order.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Itens do Pedido
              </Typography>
              <Table size="small" aria-label="items">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Impressão</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Preço Unitário</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems?.map((item) => {
                    const itemUnitPrice = item.unitPrice || 0;
                    const itemTotal = item.total || 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.product?.name}
                        </TableCell>
                        <TableCell>
                          {item.printId ? item.print?.name : "N/A"}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          € {itemUnitPrice || 0}
                        </TableCell>
                        <TableCell align="right">€ {itemTotal || 0}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <strong>Total do Pedido:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>€ {order.finalCustomerPrice || 0}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {order.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Descrição:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function OrdersList({
  orders,
  isLoading,
  onEdit,
  onDelete,
}: OrdersListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nº Pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Data</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <Row
              key={order.id}
              order={order}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
