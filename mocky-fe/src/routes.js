import withAuth from './containers/withAuth';
import Login from './containers/auth/Login';
import SignUp from './containers/auth/SignUp';
import ProjectList from './containers/project/ProjectList';
import ProjectAll from './containers/project/ProjectAll';
import ProjectDetail from './containers/project/ProjectDetail';
import FindPassword from './containers/auth/FindPassword';
import UserAll from './containers/user/UserAll';

export default [
  {
    path: '/',
    component: withAuth(ProjectList),
    exact: true,
  },
  {
    path: '/project/all',
    component: withAuth(ProjectAll),
    exact: true,
  },
  {
    path: '/project/:id',
    component: withAuth(ProjectDetail),
  },
  {
    path: '/user/login',
    component: Login,
  },
  {
    path: '/user/signUp',
    component: SignUp,
  },
  {
    path: '/user/findPassword',
    component: FindPassword,
  },
  {
    path: '/user/all',
    component: withAuth(UserAll),
  }
];
