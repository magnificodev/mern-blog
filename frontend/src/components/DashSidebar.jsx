import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");

        if (!tabFromUrl) return;
        setTab(tabFromUrl);
    }, [location]);

    return (
        <Sidebar className="w-full">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        href="/dashboard/?tab=profile"
                        icon={HiUser}
                        label="User"
                        labelColor="dark"
                        active={tab === "profile"}
                    >
                        Profile
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiArrowSmRight}>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
