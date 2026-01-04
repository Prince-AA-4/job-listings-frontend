import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
  Button,
  Chip,
  IconButton,
  Container,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const ApplicationsPage = () => {
  const { jobId } = useParams();

  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [downloadingResume, setDownloadingResume] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5600/api/applications/job/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setApplications(response.data.applications || []);

        // Get job title
        if (response.data.applications?.[0]?.job?.title) {
          setJobTitle(response.data.applications[0].job.title);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.response?.data?.message || "Failed to fetch applications");
        setApplications([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5600/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError(
        err.response?.data?.message || "Failed to update application status"
      );
    }
  };

  const downloadResume = async (applicationId) => {
    try {
      setDownloadingResume(applicationId);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5600/api/uploads/${applicationId}/resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Creating a download link
      const fileURL = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      window.open(fileURL, "_blank");

      // Clean up blob URL after opening
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 100);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Failed to open resume. Please try again.");
    } finally {
      setDownloadingResume(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "default",
      interviewed: "info",
      hired: "success",
      rejected: "error",
    };
    return colors[status] || "default";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Applications for {jobTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {applications.length} application
          {applications.length !== 1 ? "s" : ""} received
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Applications will appear here once candidates start applying
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {app?.user?.fullName || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{app.user?.userName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>{app.user?.email || "N/A"}</TableCell>
                  <TableCell>{app.user?.contact || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        renderValue={(value) => (
                          <Chip
                            label={value}
                            color={getStatusColor(value)}
                            size="small"
                          />
                        )}
                      >
                        <MenuItem value="applied">Applied</MenuItem>
                        <MenuItem value="interviewed">Interviewed</MenuItem>
                        <MenuItem value="hired">Hired</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/applications/${app.id}`)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {app.resume && (
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => downloadResume(app.id)}
                          disabled={downloadingResume === app.id}
                          title="View Resume"
                        >
                          {downloadingResume === app.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DownloadIcon />
                          )}
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ApplicationsPage;
