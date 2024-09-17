import Footer from "../components/MyFooter";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;
