import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { appTheme } from '../utils/theme';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logosrc from '../assets/Progressify2.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../utils/navigation';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const ADMIN_ONLY_SEGMENTS = ['teams']; // Segments that require admin role

function filterNavigation(navigationItems, user) {
  return navigationItems.flatMap(item => {
    // Hide item if it's admin-only and the user is not an admin
    if (user && user.role !== 'admin' && ADMIN_ONLY_SEGMENTS.includes(item.segment)) {
      return [];
    }

    const isAuthPage = item.segment === 'Authentication' || item.parent?.segment === 'Authentication';

    // Rules for logged-out users
    if (!user) {
      if (item.segment === 'login' || item.segment === 'register') {
        return [item];
      }
      if (isAuthPage && item.children) {
        const filteredChildren = filterNavigation(item.children, user);
        if (filteredChildren.length > 0) {
          return [{ ...item, children: filteredChildren }];
        }
      }
      return [];
    }

    // Rules for logged-in users
    if (user) {
      if (item.segment === 'login' || item.segment === 'register') {
        return [];
      }
    }

    if (item.children) {
      const filteredChildren = filterNavigation(item.children, user);
      if (filteredChildren.length > 0) {
        return [{ ...item, children: filteredChildren }];
      }
      if (!item.component && !item.segment) {
        return [];
      }
    }

    if (item.hidden) {
      return [];
    }

    return [item];
  });
}

function findPageComponent(pathname, navigation) {
  const currentSegment = pathname.split('/').pop();

  function searchRecursive(items) {
    for (const item of items) {
      if (item.segment === currentSegment && item.component) {
        return { component: item.component, item };
      }
      if (item.children) {
        const childResult = searchRecursive(item.children);
        if (childResult) {
          return childResult;
        }
      }
    }
    return null;
  }
  return searchRecursive(navigation);
}

function DemoPageContent({ pathname, navigation }) {
  const { user, loading, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const result = findPageComponent(pathname, navigation);
  const PageComponent = result?.component;
  const navItem = result?.item;

  React.useEffect(() => {
    if (pathname.endsWith('/logout')) {
      logout();
      navigate('/login');
      return;
    }

    if (!loading && !user && navItem && navItem.segment !== 'login' && navItem.segment !== 'register') {
      navigate('/login');
    }
    
    // Redirect if a non-admin tries to access an admin-only page
    if (!loading && user && user.role !== 'admin' && navItem && ADMIN_ONLY_SEGMENTS.includes(navItem.segment)) {
        navigate('/dashboard'); // Or to a dedicated 'unauthorized' page
    }

  }, [pathname, loading, user, navItem, navigate, logout]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (PageComponent) {
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
      <Typography>Select a page from the navigation.</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  navigation: PropTypes.array.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;
  const { user, loading } = React.useContext(AuthContext);

  const router = useDemoRouter('/Progressify');
  const location = useLocation();

  const demoWindow = window !== undefined ? window() : undefined;
  
  const filteredNav = React.useMemo(() => filterNavigation(NAVIGATION, user), [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppProvider
      navigation={filteredNav}
      branding={{
        logo: <img src={logosrc} alt="MUI logo" />,
        title: 'Progressify',
        homeUrl: user ? '/dashboard' : '/login',
      }}
      router={location.pathname.startsWith('/Progressify') ? router : undefined}
      theme={appTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={location.pathname} navigation={NAVIGATION} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
