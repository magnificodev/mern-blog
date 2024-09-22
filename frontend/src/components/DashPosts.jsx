import { useState } from "react";
import {
    useInfiniteQuery,
    useQueryClient,
    useMutation,
} from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table, Spinner, Modal, Button } from "flowbite-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getPosts, deletePost } from "../api/posts";
import { useAppContext } from "../contexts/AppContext";

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();

    const {
        data: posts,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) => getPosts({ skip: (pageParam - 1) * 5 }),
        initialPageParam: 1,
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
        refetchInterval: 10000,
        select: (data) => data.pages.flatMap((page) => page.data.posts),
    });
    
    const { mutate: deletePostMutate, isPending: isDeleting } = useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            showToast({ type: data.status, message: data.message });
            queryClient.invalidateQueries(["posts"]);
            setShowModal(false);
        },
        onError: (err) => {
            showToast({ type: "failure", message: err.message });
        },
    });

    if (isLoading)
        return (
            <div className="flex items-center mx-auto">
                <Spinner size="xl" />
            </div>
        );
    if (isError) return <p>There is something wrong</p>;

    return (
        <div className="flex-1 p-3 overflow-hidden">
            {currentUser.isAdmin && posts.length > 0 ? (
                <>
                    <div className="w-full table-auto overflow-x-auto md:mx-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 shadow-md">
                        <Table hoverable striped>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Post Image</Table.HeadCell>
                                <Table.HeadCell>Post Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>Edit</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {posts.map((post) => (
                                    <Table.Row key={post._id}>
                                        <Table.Cell>
                                            {format(
                                                new Date(post.updatedAt),
                                                "dd/MM/yyyy"
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img
                                                    src={post.image}
                                                    alt="user"
                                                    className="w-14 h-10 rounded-md bg-gray-500 object-cover"
                                                />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className="max-w-sm truncate">
                                            <Link
                                                className="font-medium text-gray-900 dark:text-gray-300"
                                                title={post.title}
                                                to={`/post/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {post.category
                                                .charAt(0)
                                                .toUpperCase() +
                                                post.category.slice(1)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                                className="font-medium text-red-500 hover:underline cursor-pointer"
                                            >
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                className="font-medium text-teal-500 hover:underline"
                                                to={`/update-post/${post._id}`}
                                            >
                                                Edit
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
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
                </>
            ) : (
                <p>You have no posts yet</p>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => deletePostMutate(postIdToDelete)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
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

export default DashPosts;
