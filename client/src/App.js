import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import Profile from './components/Profile';
import PageNotFound from './components/PageNotFound';
import AuthorizeUser, {ProtectRoute} from './middleware/auth';

const router=createBrowserRouter([
  {
    path:'/',
    element: <Username></Username>
  },
  {
    path:'/register',
    element: <Register></Register>
  },
  {
    path:'/profile',
    element:<AuthorizeUser><Profile></Profile></AuthorizeUser> 
  },
  {
    path:'/password',
    element: <ProtectRoute><Password></Password></ProtectRoute> 
  },
  {
    path:'/reset',
    element: <Reset></Reset>
  },
  {
    path:'/recovery',
    element: <Recovery></Recovery>
  },
  {
    path:'*',
    element: <PageNotFound></PageNotFound>
  }
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
