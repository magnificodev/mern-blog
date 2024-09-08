import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { googleAuth } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { mutate } = useMutation({
        mutationFn: googleAuth,
        onSuccess: (data) => {
            navigate("/");
            dispatch(signInSuccess(data.data.user))
        },
    });

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            mutate({
                name: user.displayName,
                email: user.email,
                googlePhotoUrl: user.photoURL,
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            outline
            onClick={handleGoogleClick}
        >
            <span className="flex items-center gap-2">
                <AiFillGoogleCircle size={24} />
                Continue with Google
            </span>
        </Button>
    );
};

export default OAuth;
