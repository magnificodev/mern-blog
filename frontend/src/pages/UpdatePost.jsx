import "../styles/text-editor/TextEditor.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { updatePost, getPost } from "../api/posts";

const UpdatePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [canUpload, setCanUpload] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { isDirty },
    } = useForm();

    const { data: postData, isLoading } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => getPost(postId),
    });

    useEffect(() => {
        if (postData) {
            setValue("title", postData.data.post.title);
            setValue("content", postData.data.post.content);
            setValue("category", postData.data.post.category);
            setValue("image", postData.data.post.image);
            setImageFileUrl(postData.data.post.image);
            setCanUpload(false);
        }
    }, [postData, setValue]);

    const updatePostMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: (data) => {
            navigate(`/post/${data.data.post.slug}`);
        },
    });

    const onSubmit = (updatedPostData) => {
        if (imageFileUrl) updatedPostData.image = imageFileUrl;
        updatePostMutation.mutate({ postId, postData: updatedPostData });
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
                    setImageUploadError(
                        "Couldn't upload image (File size must be < 2MB)"
                    );
                    setImageUploadProgress(null);
                    setCanUpload(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageUploadProgress(null);
                            setImageFileUrl(downloadURL);
                            setCanUpload(false);
                        }
                    );
                }
            );
        } catch (error) {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
            setCanUpload(false);
        }
    };

    if (isLoading) return <Spinner />;

    const watchedFields = watch();
    const isFormModified =
        isDirty || imageFileUrl !== postData?.data.post.image;
    const isFormUnchanged =
        watchedFields.title === postData?.data.post.title &&
        watchedFields.content === postData?.data.post.content &&
        watchedFields.category === postData?.data.post.category &&
        imageFileUrl === postData?.data.post.image;

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Update post
            </h1>
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="flex-1"
                        required
                        {...register("title")}
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
                                setValue("image", e.target.files[0], {
                                    shouldDirty: true,
                                });
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
                <img
                    src={imageFileUrl || postData?.data.post.image}
                    alt="Image"
                    className="w-full h-72 object-cover"
                />
                <TextEditor
                    register={register}
                    setValue={setValue}
                    initialValue={postData?.data.post.content}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    disabled={
                        updatePostMutation.isPending ||
                        !isFormModified ||
                        isFormUnchanged
                    }
                >
                    {updatePostMutation.isPending ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Updating...</span>
                        </>
                    ) : (
                        "Update Post"
                    )}
                </Button>
            </form>
            {updatePostMutation.isError && (
                <Alert className="mt-5" color="failure">
                    {updatePostMutation.error.message}
                </Alert>
            )}
        </div>
    );
};

export default UpdatePost;
