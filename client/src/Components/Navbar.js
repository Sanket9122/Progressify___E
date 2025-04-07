import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { appTheme } from '../utils/theme';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

// Importing the logo and pages
import logosrc from '../assets/Progressify2.jpeg';


import { NAVIGATION } from '../utils/navigation';



function DemoPageContent({ pathname, navigation }) {
  // Find the current page in navigation
  const currentPage = navigation.find(item => item.segment === pathname.split('/').pop());
  
  // If the selected page has a custom component, render it
  if (currentPage?.component) {
    const PageComponent = currentPage.component;
    return <PageComponent />;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={logosrc} alt="MUI logo" />,
        title: 'Progressify',
        homeUrl: '/Progressify',
      }}
      router={router}
      theme={appTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} navigation={NAVIGATION} />
      </DashboardLayout>
    </AppProvider>
    
  );
}

DashboardLayoutBranding.propTypes = {
  
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
