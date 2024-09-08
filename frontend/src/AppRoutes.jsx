import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Layout from "./layouts/Layout";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/sign-up" element={<Layout ><SignUp /></Layout>} />
            <Route path="/sign-in" element={<Layout ><SignIn /></Layout>} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>}/>
            </Route>
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
        </Routes>
    );
};

export default App;
