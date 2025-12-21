import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Avatar, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Icons
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import BarChartIcon from '@mui/icons-material/BarChart';

const DashBoard = () => {
    const { user } = useContext(AuthContext) || {};
    const [latestProjects, setLatestProjects] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/projects?limit=4', config);
                setLatestProjects(response.data);

                const needsAction = response.data.filter(project =>
                    project.status === 'Completed' && !project.reviewed
                );
                setActionItems(needsAction);

            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [user]);

    return (
        <Box sx={{ p: theme.spacing(3), backgroundColor: theme.palette.background, minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: theme.spacing(3) }}>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Latest Projects Section */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: '12px', height: '100%' }}>
                        <CardContent>
                            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Latest Projects</Typography>
                                <Button variant="contained" component={Link} to="/projects">View All</Button>
                            </Grid>
                            <Grid container spacing={2}>
                                {latestProjects.length > 0 ? (
                                    latestProjects.map((project) => (
                                        <Grid item xs={12} sm={6} key={project._id}>
                                            <Card variant="outlined" sx={{ borderRadius: '8px' }}>
                                                <CardContent>
                                                    <Typography variant="h6" noWrap>{project.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {project.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Status: {project.status}
                                                    </Typography>
                                                    <Button size="small" component={Link} to={`/projects/${project._id}`} sx={{ mt: 1 }}>
                                                        View Details
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography sx={{ p: 2, width: '100%' }}>No latest projects found.</Typography>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Section */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ borderRadius: '12px', height: '100%' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: theme.spacing(3) }}>
                            <Avatar sx={{ width: 80, height: 80, mb: theme.spacing(2), bgcolor: 'secondary.main' }}>
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: theme.spacing(0.5) }}>{user?.name || 'Guest'}</Typography>
                            <Typography color="text.secondary" gutterBottom>{user?.email || 'N/A'}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: theme.spacing(3) }}>
                                Role: {user?.role || 'N/A'}
                            </Typography>
                            <Button variant="outlined" component={Link} to="/profile" sx={{ mt: 'auto' }}>View Profile</Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Items Section */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: '12px', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Action Items</Typography>
                            {actionItems.length > 0 ? (
                                actionItems.map((item) => (
                                    <Card key={item._id} variant="outlined" sx={{ mb: 1.5, borderRadius: '8px' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Needs action (Status: {item.status})
                                            </Typography>
                                            <Button size="small" component={Link} to={`/projects/${item._id}`} sx={{ float: 'right' }}>
                                                Take Action
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography>No immediate action items.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Progress Analytics Section */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: '12px', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Progress Analytics</Typography>
                            <Typography>This section will display progress analytics for the logged-in user.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashBoard;