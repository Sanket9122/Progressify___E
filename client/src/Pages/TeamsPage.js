import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Paper, Button, Avatar, Chip, useTheme, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TeamsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(AuthContext) || {};

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    const fetchMyTeam = async () => {
      if (user && user.token) {
        setLoading(true);
        setError('');
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // Call the new endpoint to get the logged-in user's team
          const { data } = await axios.get('/api/team-members/my-team', config);
          setTeamData(data);
        } catch (err) {
          console.error('Error fetching team data:', err);
          setError(err.response?.data?.message || 'Failed to fetch team data. You may not be assigned to a team.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('You must be logged in to view team information.');
      }
    };

    fetchMyTeam();
  }, [user]);

  const projectManager = teamData?.teamMembers?.find(member => member.role === 'Project Manager');
  
  const roleCounts = teamData?.teamMembers?.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {});

  const teamRoles = roleCounts ? Object.keys(roleCounts).map(role => ({
    role,
    count: roleCounts[role],
  })) : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!teamData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No team data available.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : 'inherit', minHeight: '100vh', width: '100%' }}>
      
      <Typography variant="h4" sx={{ mb: 4, color: '#e53935', fontWeight: 'bold', textAlign: 'center' }}>
        Team Page
      </Typography>

      <Grid container spacing={3}>
        
        {/* Left Column: Dynamic Team Overview */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Typography sx={{ bgcolor: '#673ab7', color: 'white', p: 1.5, textAlign: 'center', fontWeight: 'bold' }}>
              Team Overview
            </Typography>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, fontSize: '2rem' }}>{getInitials(teamData.name)}</Avatar>
              <Typography variant="h5" fontWeight="bold">{teamData.name}</Typography>
              {projectManager && (
                <Typography variant="body2" color="text.secondary">
                  (Scrum Master: {projectManager.name})
                </Typography>
              )}
              <Chip label={`${teamData.name.toLowerCase().replace(' ', '-')}-team@example.com`} color="success" sx={{ my: 2, fontWeight: 'bold' }} />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ bgcolor: '#673ab7' }}
                onClick={() => navigate(`/team-details/${teamData._id}`)}
              >
                VIEW TEAM
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Dynamic Members Breakdown */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#3f51b5', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
              Team Members ({teamData.teamMembers.length})
            </Typography>
            <Grid container spacing={2}>
              {teamRoles.map((item) => (
                <Grid item xs={12} sm={6} key={item.role}>
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#673ab7' }}>{getInitials(item.role)}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{item.role}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.count} Members</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Button variant="text" sx={{ color: 'white', fontWeight: 'bold', mt: 2 }}>VIEW ALL MEMBERS</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamsPage;