import { useEffect, useState } from "react";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import { toggleTheme } from "../redux/theme/themeSlice";
import { signOut } from "../api/auth";
import { signOutSuccess } from "../redux/user/userSlice";
import { useAppContext } from "../contexts/AppContext";

const Header = () => {
    const location = useLocation();
    const { showToast } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSignedIn = currentUser !== null;

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

    const handleSignOut = () => {
        mutationSignOut.mutate();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <Navbar className="border-b-2 sticky top-0 z-50">
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    {"Magnificodev's"}
                </span>
                Blog
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <Link to="/search">
                <Button
                    className="w-12 h-10 items-center lg:hidden"
                    color="gray"
                    pill
                >
                    <AiOutlineSearch />
                </Button>
            </Link>

            <div className="flex gap-2 md:order-last">
                <Button
                    className="w-12 h-10 hidden sm:block"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </Button>

                {isSignedIn ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <img
                                alt="user"
                                src={currentUser.profilePic}
                                className="w-10 h-10 object-cover rounded-full"
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                @{currentUser.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to="/dashboard/?tab=profile">
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOut}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign in
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={location.pathname === "/"} as="div">
                    <Link className="block" to="/">
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={location.pathname === "/about"} as="div">
                    <Link className="block" to="/about">
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link
                    active={location.pathname === "/projects"}
                    as="div"
                >
                    <Link className="block" to="/projects">
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
