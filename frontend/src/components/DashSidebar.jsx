import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "../api/auth";
import { signOutSuccess } from "../redux/user/userSlice";
import { useAppContext } from "../contexts/AppContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiChartPie,
    HiAnnotation,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const { showToast } = useAppContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);

    const mutationSignOut = useMutation({
        mutationFn: signOut,
        onSuccess: (data) => {
            dispatch(signOutSuccess());
            navigate("/");
            showToast({ type: data.status, message: data.message });
        },
        onError: (err) => {
            showToast({ type: "failure", message: err.message });
        },
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");

        if (!tabFromUrl) return;
        setTab(tabFromUrl);
    }, [location]);

    return (
        <Sidebar className="w-full shadow-md">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    {currentUser.isAdmin && (
                        <Sidebar.Item
                            href="/dashboard?tab=dashboard"
                            icon={HiChartPie}
                            labelColor="dark"
                            active={tab === "dashboard"}
                        >
                            Dashboard
                        </Sidebar.Item>
                    )}
                    <Sidebar.Item
                        href="/dashboard?tab=profile"
                        icon={HiUser}
                        label={currentUser.isAdmin ? "Admin" : "User"}
                        labelColor="dark"
                        active={tab === "profile"}
                    >
                        Profile
                    </Sidebar.Item>
                    {currentUser.isAdmin && (
                        <Sidebar.Item
                            href="/dashboard?tab=comments"
                            icon={HiAnnotation}
                            labelColor="dark"
                            active={tab === "comments"}
                        >
                            Comments
                        </Sidebar.Item>
                    )}
                    {currentUser.isAdmin && (
                        <Sidebar.Item
                            href="/dashboard?tab=users"
                            icon={HiOutlineUserGroup}
                            labelColor="dark"
                            active={tab === "users"}
                        >
                            Users
                        </Sidebar.Item>
                    )}
                    {currentUser.isAdmin && (
                        <Sidebar.Item
                            href="/dashboard?tab=posts"
                            icon={HiDocumentText}
                            labelColor="dark"
                            active={tab === "posts"}
                        >
                            Posts
                        </Sidebar.Item>
                    )}
                    <Sidebar.Item
                        href="#"
                        icon={HiArrowSmRight}
                        onClick={() => mutationSignOut.mutate()}
                    >
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
