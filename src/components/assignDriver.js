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
  ListItemText,
  SwipeableDrawer,
  IconButton,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { api } from "../utils/api";
import { getUserInfo } from "../utils/localStorage";
import HistoryIcon from '@mui/icons-material/History';
const steps = ["Placed", "Driver Picked", "Delivered"];
const statusMapping = {
  new: 0,
  picked: 1,
  delivered: 2
};

const getStatusIndex = (status) => statusMapping[status] || 0;

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
    fromAddress: getUserInfo().address1+', '+getUserInfo().local,
    toAddress: "",
    senderPhone: getUserInfo().phone,
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
          width: "auto",
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
          See and Track Assigned History*
        </Typography>
        <Button  onClick={handleClick}><HistoryIcon/>History</Button>
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
        <Typography variant="h6" fontSize={'1rem'}>Assign a Driver for your Delivery</Typography>

        <Typography variant="subtitle"  fontSize={'0.85rem'}>
          *Note: Only inside Ennore area
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pickup Address"
              name="fromAddress"
              value={formData.fromAddress}
              onChange={handleChange}
              size="small"
              required // Make the field required
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
              required // Make the field required
              inputProps={{
                maxLength: 10 // Limit input to 10 characters
              }}
              error={formData.senderPhone.length !== 10} // Show error if phone number is not 10 digits
              helperText={
                formData.senderPhone.length !== 10
                  ? "Phone number must be 10 digits"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Drop Address"
              name="toAddress"
              value={formData.toAddress}
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
              required // Make the field required
              inputProps={{
                maxLength: 10 // Limit input to 10 characters
              }}
              error={formData.receiverPhone.length !== 10} // Show error if phone number is not 10 digits
              helperText={
                formData.receiverPhone.length !== 10
                  ? "Phone number must be 10 digits"
                  : ""
              }
            />
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !formData.fromAddress ||
              formData.senderPhone.length !== 10 ||
              formData.receiverPhone.length !== 10
            } // Disable button if required fields are empty or phone numbers are invalid
          >
            Assign Driver
          </Button>
        </Box>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            height: "auto",
            bottom: 0,
            overflowY: "auto" // Fixed typo: overFlowY → overflowY
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "inherit"
          }}
        >
          <IconButton onClick={handleClose}>
            <KeyboardArrowDownOutlinedIcon />
          </IconButton>

          <Box
            sx={{
              p: 2,
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Typography variant="h6" align="left" sx={{ fontSize: "1rem" }}>
              Assignment History
            </Typography>
          </Box>
        </Box>

        {/* Conditional rendering for assignments */}
        {assignmentData.length > 0 ? (
          assignmentData.map((assignment, index) => (
            <Paper key={index} sx={{ width: "auto", padding: 1, m: 1 }}>
              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                {" "}
                <LocalShippingIcon />{" "}
                <Typography sx={{ mb: 1, ml: 3, fontWeight: "500" }}>
                  {" "}
                  #{assignment._id}
                </Typography>
              </Box>
              <Stepper
                activeStep={getStatusIndex(assignment?.status || "new")}
                sx={{ mb: 2, fontSize: "0.75rem" }}
                alternativeLabel
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Typography variant="body2">
                <div>
                  Created At: {new Date(assignment.createdAt).toLocaleString()}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Ensures content flows vertically
            justifyContent: "space-between", // Adds space between top content and bottom space
            height: "100%" // Full height of the container
          }}
        >
          {/* Your other content here */}
          <Box sx={{ height: "100px" }}></Box> {/* Empty space at the bottom */}
        </Box>
      </SwipeableDrawer>
    </Container>
  );
};

export default AssignDriver;
