import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, Grid, Box, Paper } from '@mui/material';
import Header from '../components/Header/Header';
import { fetchPartners, createPartner, updatePartner, deletePartner } from "../services/deliveryPartnersApi.js";

const PartnerPage = () => {
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [partnerData, setPartnerData] = useState({
    name: '',
    email: '',
    phone: '',
    areas: '',
    shift: { start: '', end: '' }, // Include shift object
  });
  const [editingPartnerId, setEditingPartnerId] = useState(null);

  // Fetch partner data from backend
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await fetchPartners(); // Adjust to your API
        setPartners(response.data.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartner();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shift.')) {
      const shiftKey = name.split('.')[1];
      setPartnerData((prevData) => ({
        ...prevData,
        shift: {
          ...prevData.shift,
          [shiftKey]: value,
        },
      }));
    } else {
      setPartnerData({ ...partnerData, [name]: value });
    }
  };

  // Handle form submission for adding/updating partner
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPartnerId) {
        // Update existing partner
        await updatePartner(editingPartnerId, partnerData);
      } else {
        // Add new partner
        await createPartner(partnerData);
      }
      // Close modal and fetch the updated list
      setShowModal(false);
      setPartnerData({
        name: '',
        email: '',
        phone: '',
        areas: '',
        shift: { start: '', end: '' },
      });
      setEditingPartnerId(null);
      const response = await fetchPartners();
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  // Handle delete partner
  const handleDeletePartner = async (id) => {
    try {
      await deletePartner(id);
      const response = await fetchPartners();
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  // Handle editing partner
  const handleEditPartner = (partner) => {
    setPartnerData({
      name: partner.name || '',
      email: partner.email || '',
      phone: partner.phone || '',
      areas: partner.areas || '',
      shift: partner.shift || { start: '', end: '' }, // Set default shift values
    });
    setEditingPartnerId(partner._id);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="container mt-4 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Partners</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
            sx={{ marginBottom: 2 }}
          >
            Add Partner
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="partner table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Areas</TableCell>
                <TableCell>Shift (Start - End)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner._id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.areas}</TableCell>
                  <TableCell>
                    {partner.shift ? `${partner.shift.start} - ${partner.shift.end}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleEditPartner(partner)}
                      sx={{ marginRight: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePartner(partner._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for adding/editing partner */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box sx={{ ...style, width: 400 }}>
            <h2>{editingPartnerId ? 'Edit Partner' : 'Add Partner'}</h2>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    required
                    name="name"
                    value={partnerData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    required
                    type="email"
                    name="email"
                    value={partnerData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    fullWidth
                    required
                    name="phone"
                    value={partnerData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="areas"
                    fullWidth
                    required
                    name="areas"
                    value={partnerData.areas}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type='time'
                    label="Shift Start"
                    fullWidth
                    required
                    name="shift.start"
                    value={partnerData.shift.start}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type='time'
                    label="Shift End"
                    fullWidth
                    required
                    name="shift.end"
                    value={partnerData.shift.end}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                  sx={{ marginRight: 2 }}
                >
                  Close
                </Button>
                <Button variant="contained" type="submit">
                  {editingPartnerId ? 'Update Partner' : 'Add Partner'}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </div>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default PartnerPage;