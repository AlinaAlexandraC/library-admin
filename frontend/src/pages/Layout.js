import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

const Layout = () => {
    return (
        <div>
            <NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;