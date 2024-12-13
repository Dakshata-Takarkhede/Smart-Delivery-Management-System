import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  Box,
  Paper,
} from "@mui/material";
import Header from "../components/Header/Header";
import { fetchAssignments, failAssignment } from "../services/assignmentApi";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFailModal, setShowFailModal] = useState(false);
  const [failData, setFailData] = useState({
    assignmentId: "",
    reason: "",
  });

  // Fetch assignments
  useEffect(() => {
    const getAssignments = async () => {
      try {
        setLoading(true);
        const response = await fetchAssignments();
        // console.log(response.data.data); // Check the structure here
        setAssignments(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };
    getAssignments();
  }, []);
  

  // Handle Fail Assignment Input Change
  const handleFailInputChange = (e) => {
    const { name, value } = e.target;
    setFailData({ ...failData, [name]: value });
  };

  // Submit Fail Assignment
  const handleFailSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(typeof failData.reason);
      
      await failAssignment(failData.assignmentId, { reason: failData.reason });
      setShowFailModal(false);
      setFailData({ assignmentId: "", reason: "" });
      const response = await fetchAssignments();
      setAssignments(response.data.data || []);
    } catch (err) {
      setError("Failed to mark assignment as failed.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4 mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-8">Assignments</h2>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="assignments table">
              <TableHead>
                <TableRow>
                  <TableCell>Assignment ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Partner Name</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                    <TableRow key={assignment._id}>
                    <TableCell>{assignment._id}</TableCell>
                    <TableCell>{assignment.orderId ? assignment.orderId._id : "N/A"}</TableCell>
                    <TableCell>{assignment.partnerId ? assignment.partnerId.name : "N/A"}</TableCell>
                    <TableCell>{new Date(assignment.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{assignment.status}</TableCell>
                    <TableCell>{assignment.reason || "N/A"}</TableCell>
                    <TableCell>
                        {assignment.status !== "failed" && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                            setFailData({ assignmentId: assignment._id, reason: "" });
                            setShowFailModal(true);
                            }}
                        >
                            Mark as Failed
                        </Button>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>

            </Table>
          </TableContainer>
        )}

        {/* Modal for Failing Assignment */}
        <Modal open={showFailModal} onClose={() => setShowFailModal(false)}>
          <Box sx={{ ...modalStyle, width: 400 }}>
            <h2>Mark as Failed</h2>
            <form onSubmit={handleFailSubmit}>
              <TextField
                label="Reason"
                name="reason"
                fullWidth
                required
                value={failData.reason}
                onChange={handleFailInputChange}
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowFailModal(false)}
                  sx={{ marginRight: 2 }}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </div>
    </>
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

export default AssignmentsPage;
