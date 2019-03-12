import withAuth from './containers/withAuth';
import Login from './containers/auth/Login';
import SignUp from './containers/auth/SignUp';
import ProjectList from './containers/project/ProjectList';
import ProjectDetail from './containers/project/ProjectDetail';

export default [
  {
    path: '/',
    component: withAuth(ProjectList),
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
];
