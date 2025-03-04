import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FormPage from './pages/FormPage';
import LibraryPage from "./pages/LibraryPage";
import Layout from './pages/Layout';
import NotFound from './pages/NotFound';
import RandomizerPage from './pages/RandomizerPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import MyAccountPage from './pages/MyAccountPage';
import UserAgreement from './components/UserAgreement/UserAgreement';
import UserPrivacyNotice from './components/UserPrivacyNotice/UserPrivacyNotice';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/registration",
    element: <RegistrationPage />
  },
  {
    path: "/library",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/library",
        element: <LibraryPage />
      }
    ]
  },
  {
    path: "/form",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/form",
        element: <FormPage />
      }
    ]
  },
  {
    path: "/randomizer",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/randomizer",
        element: <RandomizerPage />
      }
    ]
  },
  {
    path: "/account",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/account",
        element: <MyAccountPage />
      }
    ]
  },
  {
    path: "/user-agreement",
    element: <UserAgreement />,
  },
  {
    path: "/user-privacy-notice",
    element: <UserPrivacyNotice />,
  },
  {
    path: "*",
    element: <Layout><NotFound /></Layout>,
  }
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
