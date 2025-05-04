import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddTitlesPage from './pages/AddTitlesPage/AddTitlesPage';
import LibraryPage from "./pages/LibraryPage";
import Layout from './pages/Layout';
import NotFound from './pages/NotFound/NotFound';
import RandomizerPage from './pages/RandomizerPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import MyAccountPage from './pages/MyAccountPage';
import UserAgreement from './components/UserAgreement/UserAgreement';
import UserPrivacyNotice from './components/UserPrivacyNotice/UserPrivacyNotice';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import LibraryLists from './pages/LibraryLists/LibraryLists';
import { useEffect, useState } from "react";
import ServerStatusModal from './components/ServerStatusModal/ServerStatusModal';
import useSessionRefreshWatcher from './utils/useSessionRefreshWatcher';
import SessionRefreshModal from './components/SessionRefreshModal/SessionRefreshModal';
 
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
    path: "/lists",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/lists",
        element: <LibraryLists />
      }
    ]
  },
  {
    path: "/titles/:listId",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "/titles/:listId",
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
        element: <AddTitlesPage />
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
  const [serverStatus, setServerStatus] = useState("Waking up the server... Please wait ⏳");
  const [showServerModal, setShowServerModal] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useSessionRefreshWatcher(setShowSessionModal);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      setShowServerModal(false);
      return;
    }

    let timeoutId;

    const wakeUpBackend = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health`);

        if (response.ok) {
          setServerStatus(null);
          setShowServerModal(false);

          if (timeoutId) clearTimeout(timeoutId);
        } else {
          setServerStatus("Waking up the server... Please wait ⏳");
        }
      } catch (error) {
        console.error("Error waking up backend:", error);
        setServerStatus("Failed to connect to the server. Try again later.");
      }
    };

    wakeUpBackend();

    timeoutId = setTimeout(wakeUpBackend, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
      {showSessionModal &&
        <SessionRefreshModal
          message="Your session is about to expire, do you want to stay logged in?"
          onClose={() => setShowSessionModal(false)}
        />
      }

      <ServerStatusModal message={serverStatus} showModal={showServerModal} onClose={() => setShowServerModal(false)} />
    </div>
  );
}

export default App;
