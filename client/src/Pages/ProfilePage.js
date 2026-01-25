import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../utils/api';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {user ? (
        <Box>
          <Typography variant="h6">
            Name: {user.username.firstname} {user.username.lastname}
          </Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
        </Box>
      ) : (
        <Typography>No user data found.</Typography>
      )}
    </Box>
  );
};

export default ProfilePage;