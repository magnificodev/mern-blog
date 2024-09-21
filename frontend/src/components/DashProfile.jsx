import { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";

import { useMutation } from "@tanstack/react-query";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { signOut } from "../api/auth";
import { storage } from "../firebase/firebaseConfig";
import { useAppContext } from "../contexts/AppContext";
import { deleteUser, updateUser } from "../api/users";
import {
    deleteSuccess,
    signOutSuccess,
    updateSuccess,
} from "../redux/user/userSlice";

import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [isImageUpdated, setIsImageUpdated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const filePickerRef = useRef();

    const { showToast } = useAppContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isDirty },
        reset,
    } = useForm({
        defaultValues: {
            username: currentUser.username,
            email: currentUser.email,
            password: "",
        },
    });

    const mutationUpdateUser = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            dispatch(updateSuccess(data.data.user));
            setIsImageUpdated(false);
            setImageUploadProgress(null);
            reset({
                username: data.data.user.username,
                email: data.data.user.email,
                password: "",
            });
        },
        onError: () => {
            setIsImageUpdated(false);
            setImageUploadProgress(null);
        },
    });

    const mutationDeleteUser = useMutation({
        mutationFn: deleteUser,
        onSuccess: (data) => {
            setShowModal(false);
            dispatch(deleteSuccess());
            navigate("/");
            showToast({ type: data.status, message: data.message });
        },
        onError: (err) => {
            showToast({ type: "failure", message: err.message });
        },
    });

    const mutationSignOut = useMutation({
        mutationFn: signOut,
        onSuccess: (data) => {
            dispatch(signOutSuccess());
            showToast({ type: data.status, message: data.message });
            navigate("/");
        },
        onError: (err) => {
            showToast({ type: "failure", message: err.message });
        },
    });

    const onSubmit = (userData) => {
        Object.keys(userData).forEach((field) => {
            if (
                userData[field] === currentUser[field] ||
                userData[field] === ""
            ) {
                delete userData[field];
            }
        });
        if (imageFileUrl) {
            userData.profilePic = imageFileUrl;
        }
        mutationUpdateUser.mutate({ userId: currentUser._id, userData });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        setImageUploading(true);
        setImageUploadProgress(null);
        setImageUploadError(null);

        const fileName = `${new Date().getTime()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageUploadError(
                    "Couldn't upload image (File size must be < 2MB)"
                );
                setImageUploadProgress(null);
                setImageUploading(false);
                setImageFileUrl(null);
            },
            async () => {
                const downloadUrl = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                setImageFileUrl(downloadUrl);
                setImageUploading(false);
                setIsImageUpdated(true);
            }
        );
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);


    if (mutationSignOut.isPending) {
        return (
            <div className="flex flex-col justify-center items-center w-full gap-4">
                <Spinner size="xl" />
                <span className="text-3xl font-semibold">Signing out...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className="w-32 h-32 self-center cursor-pointer relative"
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageUploadProgress && (
                        <CircularProgressbar
                            value={imageUploadProgress || 0}
                            text={`${imageUploadProgress}%`}
                            strokeWidth={6}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${
                                        imageUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePic}
                        alt="Profile Picture"
                        className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover shadow-md ${
                            imageUploadProgress &&
                            imageUploadProgress < 100 &&
                            "opacity-60"
                        }`}
                    />
                </div>
                {imageUploadError && (
                    <p className="text-center text-red-700 text-sm">
                        {imageUploadError}
                    </p>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    {...register("username")}
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    {...register("email")}
                    disabled
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={
                        ((!isDirty || imageUploading) && !isImageUpdated) ||
                        mutationUpdateUser.isPending
                    }
                >
                    {mutationUpdateUser.isPending ? (
                        <>
                            <Spinner size="sm" />
                            <span className="ml-2">Updating...</span>
                        </>
                    ) : (
                        "Update"
                    )}
                </Button>
                {currentUser.isAdmin && (
                    <Button
                        type="button"
                        gradientDuoTone="purpleToPink"
                        as={Link}
                        to="/create-post"
                        className="focus:z-10 focus:outline-none focus:ring-4 focus:ring-purple-200 hover:bg-gradient-to-l dark:focus:ring-purple-800"
                    >
                        Create a post
                    </Button>
                )}
            </form>
            <div className="flex justify-between text-red-500 mt-5">
                <span
                    className="cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    Delete Account
                </span>
                <span
                    className="cursor-pointer"
                    onClick={() => mutationSignOut.mutate()}
                >
                    Sign out
                </span>
            </div>
            {mutationUpdateUser.isError && (
                <Alert className="mt-5" color="failure">
                    {mutationUpdateUser.error.message}
                </Alert>
            )}
            {mutationUpdateUser.data && (
                <Alert className="mt-5" color="success">
                    {mutationUpdateUser.data?.message}
                </Alert>
            )}
            <Modal
                show={showModal}
                size="md"
                onClose={() => setShowModal(false)}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() =>
                                    mutationDeleteUser.mutate(currentUser._id)
                                }
                                disabled={mutationDeleteUser.isPending}
                            >
                                {mutationDeleteUser.isPending ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="ml-2">
                                            Deleting...
                                        </span>
                                    </>
                                ) : (
                                    "Yes, I'm sure"
                                )}
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModal(false)}
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashProfile;
