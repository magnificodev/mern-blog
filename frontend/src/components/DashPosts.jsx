import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Spinner, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getPosts, deletePost } from "../api/posts";

const DashPosts = () => {
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    const { mutate: deletePostMutate, isLoading: isDeleting } = useMutation({
        mutationFn: (postId) => deletePost(postId),
        onSuccess: () => {
            setShowModal(false);
            setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
            setPostIdToDelete("");
        },
    });

    const handleDeletePost = () => {
        deletePostMutate(postIdToDelete);
    };

    const { data, fetchNextPage, hasNextPage, isLoading, isError } =
        useInfiniteQuery({
            queryKey: ["posts", currentUser._id],
            queryFn: ({ pageParam }) =>
                getPosts({ pageParam, userId: currentUser._id, limit: 5 }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) =>
                lastPage.data.totalPosts > allPages.length * 5
                    ? allPages.length + 1
                    : undefined,
        });

    useEffect(() => {
        if (data) {
            const newPosts = data.pages.flatMap((page) => page.data.posts);
            setUserPosts(newPosts);
        }
    }, [data]);

    if (isLoading) return <Spinner />;
    if (isError) return <p>There is something wrong</p>;

    return (
        <div className="flex-1 p-3 overflow-hidden">
            {currentUser.isAdmin && userPosts.length > 0 ? (
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
                                {userPosts.map((post) => (
                                    <Table.Row key={post._id}>
                                        <Table.Cell>
                                            {format(
                                                post.updatedAt,
                                                "dd/MM/yyyy"
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt="Post image"
                                                className="w-20 h-10 object-cover"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="max-w-sm truncate">
                                            <Link
                                                className="font-medium text-gray-900 dark:text-gray-300"
                                                title={post.title}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>{post.category}</Table.Cell>
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
                            className="w-full text-teal-500 self-center text-sm py-4 hover:underline"
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet</p>
            )}
            {showModal && (
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
                                    onClick={handleDeletePost}
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
            )}
        </div>
    );
};

export default DashPosts;
