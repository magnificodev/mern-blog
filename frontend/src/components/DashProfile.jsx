import { Button, TextInput, Alert, Spinner, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

import {
    updateSuccess,
    deleteSuccess,
    signOutSuccess,
} from "../redux/user/userSlice";
import { deleteUser, updateUser } from "../api/users";
import { signOut } from "../api/auth";

const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [isImageUpdated, setIsImageUpdated] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const filePickerRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isDirty },
        reset,
    } = useForm({
        defaultValues: {
            userId: currentUser._id,
            username: currentUser.username,
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
                userId: data.data.user._id,
                username: data.data.user.username,
                password: "",
            });
        },
        onError: () => {
            setIsImageUpdated(false);
        },
    });

    const mutationDeleteUser = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            setOpenModal(false);
            dispatch(deleteSuccess());
            navigate("/");
        },
    });

    const mutationSignOut = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            dispatch(signOutSuccess());
            navigate("/");
        },
    });

    const onSubmit = (userData) => {
        userData.profilePic = imageFileUrl || currentUser.profilePic;
        mutationUpdateUser.mutate(userData);
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
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageUploadError("Couldn't upload image (File size must be < 2MB)");
                setImageUploadProgress(null);
                setImageUploading(false);
                setImageFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                    setImageUploading(false);
                    setIsImageUpdated(true);
                });
            }
        );
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    return (
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
                                    stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePic}
                        alt="user"
                        className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover shadow-md ${
                            imageUploadProgress && imageUploadProgress < 100 && "opacity-60"
                        }`}
                    />
                </div>
                {imageUploadError && (
                    <p className="text-center text-red-700 text-sm">{imageUploadError}</p>
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
                    defaultValue={currentUser.email}
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
                    disabled={(!isDirty || imageUploading) && !isImageUpdated}
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
                <span className="cursor-pointer" onClick={() => setOpenModal(true)}>
                    Delete Account
                </span>
                <span className="cursor-pointer" onClick={() => mutationSignOut.mutate()}>
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
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => mutationDeleteUser.mutate(currentUser._id)}>
                                {mutationDeleteUser.isPending ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="ml-2">Deleting...</span>
                                    </>
                                ) : (
                                    "Yes, I'm sure"
                                )}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
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
