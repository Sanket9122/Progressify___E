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

import {Link as RouterLink , useLocation} from 'react-router-dom';
import { NAVIGATION } from '../utils/navigation';

function filterNavigation(navigationItems) {
  return navigationItems.flatMap(item => {
    // If the item is marked hidden, skip it entirely.
    if (item.hidden) {
      return []; // return empty array to remove item
    }

    // If the item has children, recursively filter them
    if (item.children) {
      const filteredChildren = filterNavigation(item.children);
      // Only return the parent item if it still has children OR if it's a link itself.
      if (filteredChildren.length > 0) {
        return [{ ...item, children: filteredChildren }];
      }
      // If the parent is just a folder for links and all links are hidden, skip the folder.
      if (!item.component && !item.segment) {
        return [];
      }
    }
    
    // Return the item if not hidden and no children logic applied
    return [item];
  });
}
// function findPageComponent(pathname, navigation) {
//   for (const item of navigation) {
//     // 1. Check for a direct component match
//     if (pathname.endsWith(`/${item.segment}`)) {
//       if (item.component) {
//         return item.component;
//       }
//     }
    
//     // 2. Check children (nested routes)
//     if (item.children) {
//       const childComponent = findPageComponent(pathname, item.children);
//       if (childComponent) {
//         return childComponent;
//       }
//     }
//   }
//   return null;
// }
// navbar.js (The fixed findPageComponent function)

function findPageComponent(pathname, navigation) {
  // Extract the last segment of the path.
  // Example: If pathname is '/Progressify/Authentication/register', this extracts 'register'.
  // If useDemoRouter is only returning 'register', this also works.
  const currentSegment = pathname.split('/').pop();

  function searchRecursive (items)  {
    for (const item of items) {
      // 1. Check for a direct match using the last segment
      if (item.segment === currentSegment && item.component) {
          return item.component;
        
      }

      // 2. Check children (nested routes)
      if (item.children) {
        const childComponent = searchRecursive(item.children);
        if (childComponent) {
          return childComponent;
        }
      }
    }
    return null;
  }

  return searchRecursive(navigation);
}
function DemoPageContent({ pathname, navigation }) {
  // // Find the current page in navigation
  // const currentPage = navigation.find(item => item.segment === pathname.split('/').pop());
  
  // // If the selected page has a custom component, render it
  // if (currentPage?.component) {
  //   const PageComponent = currentPage.component;
  //   return <PageComponent />;
  // }
  const PageComponent = findPageComponent(pathname, navigation);

  // If a component is found, render it
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
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const router = useDemoRouter('/Progressify');
  const location = useLocation();

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    
    <AppProvider
      navigation={filterNavigation(NAVIGATION)}
      branding={{
        logo: <img src={logosrc} alt="MUI logo" />,
        title: 'Progressify',
        homeUrl: '/',
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
