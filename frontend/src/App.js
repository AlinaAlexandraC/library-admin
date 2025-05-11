import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from "react";
import Layout from './pages/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ServerStatusModal from './components/ServerStatusModal/ServerStatusModal';
import useSessionRefreshWatcher from './utils/useSessionRefreshWatcher';
import SessionRefreshModal from './components/SessionRefreshModal/SessionRefreshModal';
import Loader from './components/Loader/Loader';

const AddTitlesPage = lazy(() => import('./pages/AddTitlesPage/AddTitlesPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const LibraryLists = lazy(() => import('./pages/LibraryLists/LibraryLists'));
const RandomizerPage = lazy(() => import('./pages/RandomizerPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword/ForgotPassword'));
const MyAccountPage = lazy(() => import('./pages/MyAccountPage'));
const UserAgreement = lazy(() => import('./components/UserAgreement/UserAgreement'));
const UserPrivacyNotice = lazy(() => import('./components/UserPrivacyNotice/UserPrivacyNotice'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

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
    path: "/forgot-password",
    element: <ForgotPassword />
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
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
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
