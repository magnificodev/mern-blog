import { useEffect, useState } from "react";
import { TextInput, Button, Select, Spinner } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import { categories } from "../data/options";
const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        order: "desc",
        category: "uncategorized",
    });
    const [appliedParams, setAppliedParams] = useState({});

    const {
        data: posts,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts", appliedParams],
        queryFn: ({ pageParam = 1 }) =>
            getPosts({ ...appliedParams, skip: (pageParam - 1) * 5, limit: 5 }),
        select: (data) => data.pages.flatMap((page) => page.data.posts),
        enabled: Object.keys(appliedParams).length > 0,
        getNextPageParam: (lastPage, pages) => {
            if (
                lastPage.data.posts.length < 5 ||
                (lastPage.data.posts.length === 5 &&
                    pages.length * 5 === lastPage.data.totalPosts)
            ) {
                return undefined;
            }
            return pages.length + 1;
        },
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get("searchTerm") || "";
        const order = urlParams.get("order") || "desc";
        const category = urlParams.get("category") || "uncategorized";

        setSearchParams({ searchTerm, order, category });
        setAppliedParams({ searchTerm, order, category });
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        Object.keys(searchParams).forEach((key) => {
            if (searchParams[key]) {
                urlParams.set(key, searchParams[key]);
            }
        });
        setAppliedParams(searchParams);
        navigate(`/search?${urlParams.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="flex flex-col gap-8"
                >
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Search Term:</label>
                        <TextInput
                            className="flex-1"
                            type="text"
                            placeholder="Search..."
                            value={searchParams.searchTerm}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    searchTerm: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <Select
                            value={searchParams.order}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    order: e.target.value,
                                })
                            }
                            className="flex-1"
                        >
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <Select
                            value={searchParams.category}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    category: e.target.value,
                                })
                            }
                            className="flex-1"
                        >
                            <option value="uncategorized">
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.name}
                                </option>
                            ))}
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
                <h1 className="text-3xl font-semibold mb-4">Search Results</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <Spinner size="xl" />
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <p>No posts found.</p>
                        )}
                        {hasNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="w-full text-teal-500 self-center text-sm py-4 hover:underline"
                            >
                                {isFetchingNextPage
                                    ? "Loading more..."
                                    : "Show more"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
