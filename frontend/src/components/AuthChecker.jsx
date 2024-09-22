import { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const AuthChecker = () => {
    const { showToast } = useAppContext();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        const checkAuth = async () => {
            if (!currentUser) return;
            try {
                const response = await fetch("/api/v1/auth/check-auth");
                const { isAuth } = await response.json();
                if (!isAuth) {
                    dispatch(signOutSuccess());
                    showToast({
                        type: "failure",
                        message: "Session expired, please sign in again.",
                    });
                    navigate("/sign-in");
                }
            } catch (err) {
                showToast({
                    type: "failure",
                    message: "Something went wrong",
                });
            }
        };
        checkAuth();
    }, []);
    return null;
};

export default AuthChecker;
