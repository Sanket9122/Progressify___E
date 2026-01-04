import React from 'react';
import { Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeamsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Team Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here you can find information about your teams and team members.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Teams
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
              You are a member of 3 teams. Click below to see the list of teams you are a part of.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/teams-list')}>
              View Teams
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
              Your team has 5 members. Click below to see the details of your team members.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/team-members')}>
              View All Members
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamsPage;
