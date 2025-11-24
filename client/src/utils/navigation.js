import DashboardIcon from '@mui/icons-material/Dashboard';
import Groups3Icon from '@mui/icons-material/Groups3';
import BarChartIcon from '@mui/icons-material/BarChart';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';


//code for importing the Pages 
import DashBoard from '../Pages/DashBoard';
import TeamsPage from '../Pages/TeamsPage';
// import LoginPage from '../Pages/LoginPage';
// import SignUpPage from '../Pages/SignupPage';


export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    component: DashBoard
  },
  {
    segment: 'teams',
    title: 'Team-Members',
    icon: <Groups3Icon />,
    component: TeamsPage
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Authentication',
  },
  {
    segment: 'Authentication',
    title: 'Authentication',
    icon: <VpnKeyIcon />,
    children: [
      {
        segment: 'login',
        title: 'Login',
        icon: <LoginIcon />,
        // component: LoginPage
      },
      {
      segment: 'register', 
      title: 'Sign Up',
      // icon: <LogoutIcon />,
      // component: SignUpPage , 
      hidden :true, 
    },
      {
        segment: 'logout',
        title: 'Logout',
        icon: <LogoutIcon />,
      },
    ],
  },
];
