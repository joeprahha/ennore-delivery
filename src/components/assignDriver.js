import React, { useState } from "react";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { api } from "../utils/api";
import { getUserInfo } from "../utils/localStorage";
const locations = [
  "Nettukuppam",
  "Ennore Kuppam",
  "Thazhankuppam",
  "Mugathuvara Kuppam",
  "Ulagnathapuram",
  "SVM Nagar",
  "Vallur Nagar",
  "Kamaraj Nagar",
  "High School Surroundings",
  "Kaathukuppam",
  "RS Road",
  "Ennore Bus Depot Surroundings"
];

const AssignDriver = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: getUserInfo()._id, // Add customerId
    fromAddress: "",
    toAddress: "",
    senderPhone: "",
    receiverPhone: ""
  });
  const [assignmentData, setAssignmentData] = useState([]);

  const handleClick = async () => {
    try {
      const response = await api.get(
        `/assign-driver?customerId=${getUserInfo()._id}`
      );
      setAssignmentData(response.data.assignments); // Assuming the API returns an array of assignments
      setOpen(true); // Open the modal after fetching data
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  // Close modal
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("assign-driver", formData);
      console.log("response");
      alert("Driver assigned successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver.");
    }
  };

  return (
    <Container sx={{ m: 0, p: 0 }}>
      <Box
        sx={{
          m: 1,
          flex: 1,
          width: "85%",
          padding: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          justifyContent: "space-between", // Ensures typography and button are on the same line
          alignItems: "center"
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "0.75rem" }} gutterBottom>
          See Assigned History
        </Typography>
        <Button onClick={handleClick}>History</Button>
      </Box>

      <Box
        sx={{
          //   position: "absolute",
          // top: "40%",
          //  left: "50%",
          //  transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          // boxShadow: 1,
          width: "85%",
          borderRadius: "8px"
        }}
      >
        <Typography variant="h6">Assign a Driver</Typography>

        <Typography variant="subtitle">
          *Note: Only inside Ennore area
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="From Address"
              name="fromAddress"
              value={formData.fromAddress}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="To Address"
              name="toAddress"
              value={formData.toAddress}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sender Phone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Receiver Phone"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Assign Driver
          </Button>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="assignment-history-modal"
        aria-describedby="modal-showing-assignment-history"
        sx={{ maxHeight: "80vh" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 1,
            width: "80%",
            maxHeight: "80vh", // Set max height to 80% of viewport height
            maxWidth: "600px",
            boxShadow: 24,
            overflowY: "auto" // Enable vertical scrolling
          }}
        >
          <Typography variant="h6" gutterBottom>
            Assignment History
          </Typography>

          {/* Show list of assignments */}
          {assignmentData.length > 0 ? (
            [
              ...assignmentData,
              ...assignmentData,
              ...assignmentData,
              ...assignmentData
            ].map((assignment, index) => (
              <Paper key={index} sx={{ width: "auto", padding: 1, mb: 1 }}>
                <Typography variant="body2">
                  Assignment ID: {assignment._id}
                </Typography>
                <Typography variant="body2">
                  <div>
                    Created At:{" "}
                    {new Date(assignment.createdAt).toLocaleString()}
                  </div>
                  <div>
                    From: {assignment.fromAddress} To: {assignment.toAddress}
                  </div>
                  <div>
                    Driver: {assignment.driverName}, Phone:{" "}
                    {assignment.driverPhone}
                  </div>
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No assignments found.</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AssignDriver;
