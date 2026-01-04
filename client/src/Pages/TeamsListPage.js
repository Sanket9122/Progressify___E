import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const teams = [
  { id: 1, name: 'Frontend Developers', description: 'Responsible for the user interface and user experience.' },
  { id: 2, name: 'Backend Developers', description: 'Responsible for the server-side logic and database.' },
  { id: 3, name: 'Designers', description: 'Responsible for the visual design and branding.' },
];

const TeamsListPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teams
      </Typography>
      <Paper>
        <List>
          {teams.map((team) => (
            <ListItem key={team.id}>
              <ListItemText primary={team.name} secondary={team.description} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TeamsListPage;
