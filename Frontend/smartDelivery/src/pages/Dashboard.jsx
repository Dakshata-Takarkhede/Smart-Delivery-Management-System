import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header.jsx";
import Card from "../components/Dashboard/Card.jsx";
import {
  People as PeopleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  LocalShipping as LocalShippingIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";
import { fetchDashboardMetrics } from "../services/dashboardMetricsApi.js"; // Import API function
import { fetchAssignmentMetrics } from "../services/assignmentApi.js"; // Import assignment metrics API
import MapComponent from "../components/Dashboard/Map.jsx";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPartners: 0,
    completedOrders: 0,
    pendingDeliveries: 0,
    activeAssignments: 0,
  });
  const [assignmentMetrics, setAssignmentMetrics] = useState({
    totalAssignments: 0,
    successfulAssignments: 0,
    failedAssignments: 0,
    pendingAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, assignmentResponse] = await Promise.all([
          fetchDashboardMetrics(), // Call dashboard metrics API
          fetchAssignmentMetrics(), // Call assignment metrics API
        ]);
        // console.log(assignmentResponse);
        
        setDashboardData(dashboardResponse.data.data); // Set dashboard metrics data
        setAssignmentMetrics(assignmentResponse.data.data); // Set assignment metrics
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load metrics.");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Dashboard Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Error or Loading */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && <p className="text-gray-500 text-center">Loading...</p>}

        {/* Cards Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Partners */}
              <Card
                title="Total Partners"
                value={dashboardData.totalPartners}
                icon={<PeopleIcon fontSize="inherit" />}
                color="blue"
              />

              {/* Completed Orders */}
              <Card
                title="Completed Orders"
                value={dashboardData.completedOrders}
                icon={<AssignmentTurnedInIcon fontSize="inherit" />}
                color="green"
              />

              {/* Pending Deliveries */}
              <Card
                title="Pending Deliveries"
                value={dashboardData.pendingDeliveries}
                icon={<LocalShippingIcon fontSize="inherit" />}
                color="orange"
              />

              {/* Active Assignments */}
              <Card
                title="Active Assignments"
                value={dashboardData.activeAssignments}
                icon={<TaskAltIcon fontSize="inherit" />}
                color="purple"
              />
            </div>

            {/* Assignment Metrics Table */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignment Metrics</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Assignments</TableCell>
                      <TableCell align="right">{assignmentMetrics.totalAssignments}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Successful Assignments</TableCell>
                      <TableCell align="right">{assignmentMetrics.successfulAssignments}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Failed Assignments</TableCell>
                      <TableCell align="right">{assignmentMetrics.failedAssignments}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pending Assignments</TableCell>
                      <TableCell align="right">{assignmentMetrics.pendingAssignments}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
