import DashboardIcon from '@mui/icons-material/Dashboard';
import Groups3Icon from '@mui/icons-material/Groups3';
import BarChartIcon from '@mui/icons-material/BarChart';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder'; // Import for projects icon
import PersonIcon from '@mui/icons-material/Person'; // Import for profile icon


//code for importing the Pages 
import DashBoard from '../Pages/DashBoard';
import TeamsPage from '../Pages/TeamsPage';
import ProjectsPage from '../Pages/ProjectsPage'; // Import ProjectsPage
import ProfilePage from '../Pages/ProfilePage'; // Import ProfilePage
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
    segment: 'projects', // New segment for projects
    title: 'Projects',
    icon: <FolderIcon />,
    component: ProjectsPage
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
      {
        segment: 'profile', // New segment for profile
        title: 'Profile',
        icon: <PersonIcon />,
        component: ProfilePage,
      },
    ],
  },
];
