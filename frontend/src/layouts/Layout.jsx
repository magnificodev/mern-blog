import Footer from "../components/MyFooter";
import Header from "../components/Header";

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;
