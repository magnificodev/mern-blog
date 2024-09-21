import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashDashboard from "../components/DashDashboard";

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");

        if (!tabFromUrl) return;
        setTab(tabFromUrl);
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            {tab === "dashboard" && <DashDashboard />}
            {tab === "profile" && <DashProfile />}
            {tab === "comments" && <DashComments />}
            {tab === "users" && <DashUsers />}
            {tab === "posts" && <DashPosts />}
        </div>
    );
};

export default Dashboard;
