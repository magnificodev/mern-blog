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
import { updatePost, getPosts } from "../api/posts";

const UpdatePost = () => {
    const { postId } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const navigate = useNavigate();

    const { register, setValue, getValues, handleSubmit, watch } = useForm();

    const { data } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => getPosts({ postId }),
    });

    const postData = data?.data.posts[0];

    useEffect(() => {
        if (postData) {
            setValue("title", postData.title);
            setValue("content", postData.content);
            setValue("category", postData.category);
            setValue("image", postData.image);
        }
    }, [postData, setValue]);

    const updatePostMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: (data) => {
            navigate(`/post/${data.data.post.slug}`);
        },
    });

    const onSubmit = (updatedPostData) => {
        updatePostMutation.mutate({ postId, postData: updatedPostData });
    };

    const handleUploadImage = async () => {
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
                },
                async () => {
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );
                    setImageUploadProgress(null);
                    setValue("image", downloadURL, { shouldDirty: true });
                }
            );
        } catch (error) {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };

    const watchedFields = watch();
    const isFormUnchanged =
        watchedFields.title === postData?.title &&
        watchedFields.content === postData?.content &&
        watchedFields.category === postData?.category &&
        watchedFields.image === postData?.image;

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
                <div className="flex flex-col gap-4 border-4 border-dotted border-teal-500 p-4">
                    <div className="flex gap-4 items-center justify-between">
                        <FileInput
                            id="file"
                            accept="image/*"
                            className="flex-1"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImageFile(file);
                                }
                            }}
                        />
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            size="md"
                            outline
                            disabled={!imageFile || imageUploadProgress}
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
                {getValues("image") && (
                    <img
                        src={getValues("image")}
                        alt="Post image"
                        className="w-full h-72 object-cover"
                    />
                )}
                {getValues("content") && (
                    <TextEditor
                        register={register}
                        setValue={setValue}
                        initialValue={getValues("content")}
                    />
                )}
                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    disabled={updatePostMutation.isPending || isFormUnchanged}
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
