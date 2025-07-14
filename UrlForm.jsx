import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import logMiddleware from '../utils/logger';
import { isValidUrl, isValidShortcode, isValidMinutes } from '../utils/validators';
import { createShortcode } from '../utils/shortener';

const UrlForm = () => {
  const MAX_ROWS = 5;

  const [formRows, setFormRows] = useState([
    { url: '', validity: '', shortcode: '', error: '' },
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newRows = [...formRows];
    newRows[index][field] = value;
    newRows[index].error = '';
    setFormRows(newRows);
  };

  const addRow = () => {
    if (formRows.length < MAX_ROWS) {
      setFormRows([...formRows, { url: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  const handleSubmit = () => {
    const data = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
    const newResults = [];

    const newFormRows = formRows.map((row) => {
      const { url, validity, shortcode } = row;
      const minutes = validity ? parseInt(validity) : 30;

      // Validation
      if (!isValidUrl(url)) {
        return { ...row, error: 'Invalid URL format' };
      }
      if (validity && !isValidMinutes(validity)) {
        return { ...row, error: 'Validity must be a number' };
      }
      if (shortcode && !isValidShortcode(shortcode)) {
        return { ...row, error: 'Shortcode must be alphanumeric (4-10 chars)' };
      }

      try {
        const finalCode = createShortcode(shortcode, data);
        const expiry = new Date(Date.now() + minutes * 60000).toISOString();
        const entry = {
          originalUrl: url,
          expiry,
          createdAt: new Date().toISOString(),
          clicks: [],
        };

        data[finalCode] = entry;
        newResults.push({
          shortcode: finalCode,
          originalUrl: url,
          expiry,
        });

        logMiddleware('URL Shortened', {
          originalUrl: url,
          shortcode: finalCode,
          expiry,
        });

        return { url: '', validity: '', shortcode: '', error: '' };
      } catch (err) {
        return { ...row, error: 'Shortcode already exists' };
      }
    });

    setFormRows(newFormRows);
    setResults(newResults);
    localStorage.setItem('shortenedUrls', JSON.stringify(data));
  };

  return (
    <Box>
      {formRows.map((row, index) => (
        <Paper key={index} sx={{ p: 2, my: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Long URL"
                value={row.url}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Validity (mins)"
                value={row.validity}
                onChange={(e) => handleChange(index, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={row.shortcode}
                onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography color="error">{row.error}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={addRow}
          disabled={formRows.length >= MAX_ROWS}
          sx={{ mr: 2 }}
        >
          Add Row
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Results:</Typography>
          {results.map((result, idx) => (
            <Paper key={idx} sx={{ p: 2, my: 1 }}>
              <Typography>Original URL: {result.originalUrl}</Typography>
              <Typography>
                Shortened: <a href={`http://localhost:3000/${result.shortcode}`} target="_blank" rel="noreferrer">
                  {`http://localhost:3000/${result.shortcode}`}
                </a>
              </Typography>
              <Typography>Expires: {new Date(result.expiry).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UrlForm;
