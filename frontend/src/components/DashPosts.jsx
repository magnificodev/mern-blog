import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getPosts } from "../api/posts";

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["posts", currentUser._id],
        queryFn: ({ pageParam }) =>
            getPosts({ pageParam, userId: currentUser._id, limit: 5 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.data.totalPosts > allPages.length * 5
                ? allPages.length + 1
                : undefined,
    });

    return (
        <div className="flex-1 p-3 overflow-hidden">
            {currentUser.isAdmin && data?.pages.length > 0 ? (
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
                                {data?.pages.map((page) =>
                                    page.data.posts.map((post) => (
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
                                            <Table.Cell>
                                                {post.category}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link className="font-medium text-red-500 hover:underline">
                                                    Delete
                                                </Link>
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
                                    ))
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                    {hasNextPage && (
                        <button
                            onClick={fetchNextPage}
                            className="w-full text-teal-500 self-center text-sm py-4 hover:underline"
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No Posts</p>
            )}
        </div>
    );
};

export default DashPosts;
