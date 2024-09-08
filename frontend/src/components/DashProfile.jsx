import { Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(e.target.files[0]);
        setImageFileUrl(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        setImageFileUploadProgress(null);
        setImageFileUploadError(null);

        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    "Couldn't upload image (File size must be < 2MB)"
                );
                setImageFileUploadProgress(null)
                setImageFileUrl(null)
            },
            () =>
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                })
        );
    };

    useEffect(() => {
        if (!imageFile) return;
        uploadImage();
    }, [imageFile]);

    return (
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
            <form action="" className="flex flex-col gap-4">
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
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
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
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePic}
                        alt="user"
                        className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover shadow-md ${
                            imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            "opacity-60"
                        }`}
                    />
                </div>
                {imageFileUploadError && (
                    <p className="text-center text-red-700 text-sm">
                        {imageFileUploadError}
                    </p>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type="text"
                    id="password"
                    placeholder="Password"
                    defaultValue={currentUser.password}
                />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="flex justify-between text-red-500 mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign out</span>
            </div>
        </div>
    );
};

export default DashProfile;
