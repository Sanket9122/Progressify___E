import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Avatar } from '@mui/material';

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer' },
  { id: 2, name: 'Jane Smith', role: 'Backend Developer' },
  { id: 3, name: 'Peter Jones', role: 'UI/UX Designer' },
  { id: 4, name: 'Mary Williams', role: 'Frontend Developer' },
  { id: 5, name: 'David Brown', role: 'Backend Developer' },
];

const TeamMembersPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Team Members
      </Typography>
      <Paper>
        <List>
          {teamMembers.map((member) => (
            <ListItem key={member.id}>
              <Avatar sx={{ mr: 2 }}>{member.name.charAt(0)}</Avatar>
              <ListItemText primary={member.name} secondary={member.role} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TeamMembersPage;