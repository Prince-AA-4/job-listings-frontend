import { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  availability: "immediate",
  salary: "",
  coverLetter: "",
  consent: false,
};

export default function JobApplicationForm({ jobId }) {
  const [values, setValues] = useState(initial);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "Required";
    if (!values.lastName.trim()) e.lastName = "Required";
    if (!values.email.trim() || !/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Valid email required";
    if (!values.phone.trim()) e.phone = "Required";
    if (!resume) e.resume = "Resume is required";
    if (!values.coverLetter.trim()) e.coverLetter = "Please add a short note";
    if (!values.consent) e.consent = "Please accept to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("jobId", jobId ?? "");
      Object.entries(values).forEach(([k, v]) => form.append(k, v));
      form.append("resume", resume);

      const res = await fetch("/api/applications", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to submit");

      setValues(initial);
      setResume(null);
      setErrors({});
      alert("Application submitted successfully!");
    } catch (err) {
      alert("There was a problem submitting your application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Apply for this job
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First name"
            value={values.firstName}
            onChange={handleChange("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last name"
            value={values.lastName}
            onChange={handleChange("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            value={values.phone}
            onChange={handleChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Location (City, Country)"
            value={values.location}
            onChange={handleChange("location")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              label="Availability"
              value={values.availability}
              onChange={handleChange("availability")}
            >
              <MenuItem value="immediate">Immediate</MenuItem>
              <MenuItem value="2-weeks">2 weeks</MenuItem>
              <MenuItem value="1-month">1 month</MenuItem>
              <MenuItem value="negotiable">Negotiable</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="LinkedIn URL"
            value={values.linkedin}
            onChange={handleChange("linkedin")}
            fullWidth
            placeholder="https://linkedin.com/in/username"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Portfolio or GitHub URL"
            value={values.portfolio}
            onChange={handleChange("portfolio")}
            fullWidth
            placeholder="https://yourportfolio.com"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Salary expectation (optional)"
            value={values.salary}
            onChange={handleChange("salary")}
            fullWidth
            placeholder="e.g. 5000 GHS/month"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            color={errors.resume ? "error" : "primary"}
          >
            {resume ? "Resume attached" : "Upload resume (PDF, DOCX)"}
            <input
              hidden
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            />
          </Button>
          {errors.resume && (
            <Typography variant="caption" color="error">
              {errors.resume}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Cover letter / motivation"
            value={values.coverLetter}
            onChange={handleChange("coverLetter")}
            error={!!errors.coverLetter}
            helperText={errors.coverLetter || "Briefly explain why you’re a strong fit."}
            fullWidth
            multiline
            minRows={5}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.consent}
                onChange={(e) =>
                  setValues((v) => ({ ...v, consent: e.target.checked }))
                }
              />
            }
            label="I consent to my data being used to process this application."
          />
          {errors.consent && (
            <Typography variant="caption" color="error">
              {errors.consent}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit application"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
