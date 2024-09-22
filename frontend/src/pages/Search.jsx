import { useEffect } from "react";
import { TextInput, Button, Select, Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts";
import PostCard from "../components/PostCard";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit, getValues, setValue } = useForm();

    useEffect(() => {
        console.log(location.search)
        const urlParams = new URLSearchParams(location.search);
        setValue("searchTerm", urlParams.get("searchTerm") || "");
        setValue("order", urlParams.get("order") || "desc");
        setValue("category", urlParams.get("category") || "uncategorized");
    }, [location.search]);

    const {
        data: posts,
        isLoading,
    } = useQuery({
        queryKey: ["posts", location.search],
        queryFn: () =>
            getPosts({
                searchTerm: getValues("searchTerm"),
                order: getValues("order"),
                category: getValues("category"),
            }),
        select: (data) => data.data.posts,
        staleTime: 0,
    });

    const onSubmit = (formData) => {
        const urlParams = new URLSearchParams(location.search);
        Object.keys(formData).forEach((key) => {
            if (!!formData[key]) {
                console.log(key, formData[key]);
                urlParams.set(key, formData[key]);
            }
        });
        navigate(`/search?${urlParams.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8"
                >
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Search Term:</label>
                        <TextInput
                            type="text"
                            placeholder="Search..."
                            {...register("searchTerm")}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <Select {...register("order")}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <Select {...register("category")}>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="javascript">Javascript</option>
                            <option value="reactjs">ReactJS</option>
                            <option value="nextjs">NextJS</option>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        gradientDuoTone="purpleToPink"
                        outline
                        className="w-full"
                    >
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className="w-full p-7">
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <Spinner size="xl" />
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold mb-4">
                            Search Results
                        </h1>
                        <div className="flex flex-wrap gap-4">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))
                            ) : (
                                <p>No posts found.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
