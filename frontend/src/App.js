import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setSessionExpiredHandler } from './utils/sessionExpiredHandler';
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
  const [userLoaded, setUserLoaded] = useState(false);

  const {
    expired,
    signOutUser,
    resetTimer,
    clearExpired
  } = useSessionRefreshWatcher(setShowSessionModal, userLoaded);

  const handleStayLoggedIn = () => {
    setShowSessionModal(false);
    resetTimer();
  };

  const handleLogOut = async () => {
    setShowSessionModal(false);
    await signOutUser();
  };

  // useEffect(() => {
  //   const auth = getAuth();

  //   let timeoutId;

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUserLoaded(true);

  //     if (user) {
  //       clearExpired();

  //       // Delay setting handler slightly after confirmed login
  //       timeoutId = setTimeout(() => {
  //         console.log("✅ Session expired handler SET (delayed)");
  //         setSessionExpiredHandler(() => setShowSessionModal(true));
  //       }, 3000);
  //     } else {
  //       console.log("❌ Session expired handler CLEARED");
  //       setSessionExpiredHandler(null);
  //     }
  //   });

  //   // Cleanup happens on component unmount OR on effect re-run
  //   return () => {
  //     unsubscribe();
  //     if (timeoutId) clearTimeout(timeoutId);
  //     setSessionExpiredHandler(null); // <- ensure it’s always cleared when component goes
  //   };
  // }, [clearExpired]);

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

      {userLoaded && showSessionModal && !expired && (
        <SessionRefreshModal
          message="Your session is about to expire, do you want to stay logged in?"
          onClose={handleStayLoggedIn}
          onLogout={handleLogOut}
        />
      )}

      {userLoaded && expired && !showSessionModal && (
        <SessionRefreshModal
          message="Your session has expired. Please log in again."
          onClose={() => window.location.replace('/')}
          expired={true}
        />
      )}

      <ServerStatusModal message={serverStatus} showModal={showServerModal} onClose={() => setShowServerModal(false)} />
    </div>
  );
}

export default App;
