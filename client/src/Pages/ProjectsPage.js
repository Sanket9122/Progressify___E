import React, { useState, useEffect } from 'react';
import { getProjects } from '../utils/api';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
        Projects
      </Typography>
      {projects.length > 0 ? (
        <List>
          {projects.map((project) => (
            <ListItem key={project._id} divider>
              <ListItemText
                primary={project.name}
                secondary={project.description}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No projects found.</Typography>
      )}
    </Box>
  );
};

export default ProjectsPage;