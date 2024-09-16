import { useState } from "react";
import {
    TextInput,
    Select,
    FileInput,
    Button,
    Spinner,
    Progress,
    Alert,
} from "flowbite-react";
import TextEditor from "../components/text-editor/TextEditor";
import { storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api/posts";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [canUpload, setCanUpload] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const navigate = useNavigate();

    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            navigate(`/post/${data.data.post.slug}`)
        },
    });

    const onSubmit = (postData) => {
        if (imageFileUrl) postData.image = imageFileUrl;
        createPostMutation.mutate(postData);
    };

    const handleUploadImage = () => {
        try {
            setImageUploadProgress(null);
            setImageUploadError(null);

            const fileName = new Date().getTime() + "_" + imageFile.name;
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
                    setImageUploadError("Image upload failed");
                    setImageUploadProgress(null);
                    setCanUpload(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadUrl) => {
                            setImageFileUrl(downloadUrl);
                            setImageUploadProgress(null);
                            setCanUpload(false);
                        }
                    );
                }
            );
        } catch (err) {
            setImageUploadError("Image upload failed");
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create a Post
            </h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="flex-1"
                        required
                        {...register("title", {
                            required: "This field is required",
                        })}
                    />
                    <Select id="categories" {...register("category")}>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="reactjs">ReactJS</option>
                        <option value="nextjs">NextJS</option>
                    </Select>
                </div>
                <div className="flex flex-col gap-4 border-4 border-dotted border-teal-500 p-4 text-">
                    <div className="flex gap-4 items-center justify-between">
                        <FileInput
                            id="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={(e) => {
                                setImageFile(e.target.files[0]);
                                setCanUpload(
                                    e.target.files[0] &&
                                        imageFile !== e.target.files[0]
                                );
                            }}
                        />
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            size="md"
                            outline
                            disabled={!canUpload || imageUploadProgress}
                            onClick={handleUploadImage}
                            className="flex-none w-32"
                        >
                            {imageUploadProgress ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Uploading...</span>
                                </>
                            ) : (
                                "Upload image"
                            )}
                        </Button>
                    </div>
                    {imageUploadProgress && (
                        <Progress
                            progress={imageUploadProgress}
                            labelProgress
                            size="md"
                            className="text-xs"
                        />
                    )}
                </div>
                {imageUploadError && (
                    <Alert color="failure">{imageUploadError}</Alert>
                )}
                {imageFileUrl && (
                    <img
                        src={imageFileUrl}
                        alt="Image"
                        className="w-full h-72 object-cover"
                    />
                )}
                <TextEditor
                    register={register}
                    setValue={setValue}
                    errors={errors}
                />
                <Button type="submit" gradientDuoTone="purpleToPink">
                    Publish
                </Button>
            </form>
            {createPostMutation.isError && (
                <Alert className="mt-5" color="failure">
                    {createPostMutation.error.message}
                </Alert>
            )}
            {createPostMutation.data && (
                <Alert className="mt-5" color="success">
                    {createPostMutation.data.message}
                </Alert>
            )}
        </div>
    );
};

export default CreatePost;
