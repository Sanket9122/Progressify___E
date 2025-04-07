import React from 'react' ; 
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
const DashBoard = () => {
    return (
        <div className=''>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4">Dashboard</Typography>
                <Typography>This is your dashboard</Typography>
            </Box>
        </div>
    )
}
export default DashBoard;