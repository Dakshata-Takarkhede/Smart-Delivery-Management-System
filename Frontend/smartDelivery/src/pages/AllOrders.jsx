import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import Header from "../components/Header/Header";
import { fetchOrders, createOrder } from "../services/ordersApi"; // API functions
import { assignOrder } from "../services/assignmentApi";
import { fetchPartners } from "../services/deliveryPartnersApi"; // API to fetch partners

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [newOrder, setNewOrder] = useState({
    customer: { name: "", phone: "", address: "" },
    items: [{ name: "", quantity: 1, price: 0 }],
    area: "",
    scheduledFor: "",
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch orders and partners simultaneously
        const [ordersResponse, partnersResponse] = await Promise.all([
          fetchOrders(),
          fetchPartners(),
        ]);
        setOrders(ordersResponse.data.data);
        setPartners(partnersResponse.data.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle assign order functionality
  const handleAssignOrder = async () => {
    try {
      if (selectedPartner) {
        // Send partner name instead of partner ID
        await assignOrder(selectedOrder, selectedPartner);
        setShowAssignModal(false);
        // Refresh orders after assignment
        const ordersResponse = await fetchOrders();
        setOrders(ordersResponse.data.data);
      } else {
        setError("Please select a partner.");
      }
    } catch (err) {
      setError("Failed to assign order.");
    }
  };

  // Handle add order functionality
  const handleAddOrder = async () => {
    try {
      // console.log(newOrder);
      
      await createOrder(newOrder);
      setShowAddModal(false);
      // Refresh orders after adding a new order
      const ordersResponse = await fetchOrders();
      setOrders(ordersResponse.data.data);
      // Reset new order form
      setNewOrder({
        customer: { name: "", phone: "", address: "" },
        items: [{ name: "", quantity: 1, price: 0 }],
        scheduledFor: "",
        totalAmount: 0,
        area: "",
      });
    } catch (err) {
      setError("Failed to add order.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-4 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold mb-8">Orders</h2>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddModal(true)}
            style={{ marginBottom: "16px" }}
          >
            Add Order
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="order table">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.customer.phone}</TableCell>
                    <TableCell>{order.customer.address}</TableCell>
                    <TableCell>{order.area}</TableCell>
                    <TableCell>
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {order.status === "pending" && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setSelectedOrder(order._id);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign Partner
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Assign Partner Modal */}
        <Modal open={showAssignModal} onClose={() => setShowAssignModal(false)}>
          <Box sx={{ ...modalStyle, width: 400 }}>
            <h2>Assign Partner to Order</h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Partner"
                  fullWidth
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Partner</option>
                  {partners.map((partner) => (
                    <option key={partner._id} value={partner.name}>
                      {partner.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAssignModal(false)}
                sx={{ marginRight: 2 }}
              >
                Close
              </Button>
              <Button variant="contained" onClick={handleAssignOrder}>
                Assign Order
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Add Order Modal */}
        <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
          <Box sx={{ ...modalStyle, width: 500 }}>
            <h2>Add New Order</h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  value={newOrder.customer.name}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, name: e.target.value },
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Phone"
                  fullWidth
                  value={newOrder.customer.phone}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, phone: e.target.value },
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  value={newOrder.customer.address}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      customer: { ...prev.customer, address: e.target.value },
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Area"
                  fullWidth
                  value={newOrder.area}
                  onChange={(e) =>
                    setNewOrder((prev) => ({...prev, area: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Item Name"
                  fullWidth
                  value={newOrder.items[0].name}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      items: [{ ...prev.items[0], name: e.target.value }],
                    }))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={newOrder.items[0].quantity}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      items: [{ ...prev.items[0], quantity: parseInt(e.target.value) }],
                    }))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  value={newOrder.items[0].price}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      items: [{ ...prev.items[0], price: parseFloat(e.target.value) }],
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Scheduled For"
                  type="time"
                  fullWidth
                  value={newOrder.scheduledFor}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, scheduledFor: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Amount"
                  type="number"
                  fullWidth
                  value={newOrder.totalAmount}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      totalAmount: parseFloat(e.target.value),
                    }))
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddModal(false)}
                sx={{ marginRight: 2 }}
              >
                Close
              </Button>
              <Button variant="contained" onClick={handleAddOrder}>
                Add Order
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default OrdersPage;
