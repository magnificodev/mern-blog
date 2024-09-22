import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";
import { getComments } from "../api/comments";
import { getPosts } from "../api/posts";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, Table } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { getPost } from "../api/posts";
import {
    HiOutlineUserGroup,
    HiAnnotation,
    HiDocumentText,
    HiArrowNarrowUp,
} from "react-icons/hi";

const DashDashboard = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const { data: userData, isLoading: isUsersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        select: (data) => data.data.users,
    });

    const { data: commentData, isLoading: isCommentsLoading } = useQuery({
        queryKey: ["comments"],
        queryFn: getComments,
        select: (data) => data.data.comments,
    });

    const { data: postData, isLoading: isPostsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        select: (data) => data.data.posts,
    });

    const { mutate: getPostMutate } = useMutation({
        mutationFn: getPost,
        onSuccess: (data) => {
            navigate(`/post/${data.data.post.slug}`);
        },
    });

    if (isUsersLoading && isCommentsLoading && isPostsLoading) {
        return (
            <div className="flex items-center mx-auto">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-3 overflow-hidden">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Users
                            </h3>
                            <p className="text-2xl">{userData?.totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {userData?.lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Comments
                            </h3>
                            <p className="text-2xl">
                                {commentData?.totalComments}
                            </p>
                        </div>
                        <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {commentData?.lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">
                                Total Posts
                            </h3>
                            <p className="text-2xl">{postData?.totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex  gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {postData?.lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last month</div>
                    </div>
                </div>
            </div>

            {/* Another */}

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                {userData?.length > 0 && (
                    <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                        <div className="flex justify-between items-center p-3 text-sm font-semibold">
                            <h1 className="text-center p-2">Recent users</h1>
                            <a
                                href="/dashboard?tab=users"
                                className="text-green-500 hover:underline"
                            >
                                See all
                            </a>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>User image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                            </Table.Head>
                            {userData.map((user) => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={user.profilePic}
                                                alt="user"
                                                className="w-10 h-10 rounded-full bg-gray-500 object-cover"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="font-medium text-gray-900 dark:text-gray-300">
                                                {user._id === currentUser._id
                                                    ? `${user.username} (You)`
                                                    : user.username}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </div>
                )}
                {commentData?.length > 0 && (
                    <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                        <div className="flex justify-between items-center p-3 text-sm font-semibold">
                            <h1 className="text-center p-2">Recent comments</h1>
                            <a
                                href="/dashboard?tab=comments"
                                className="text-green-500 hover:underline"
                            >
                                See all
                            </a>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Comment content</Table.HeadCell>
                                <Table.HeadCell>Likes</Table.HeadCell>
                            </Table.Head>
                            {commentData.map((comment) => (
                                <Table.Body
                                    key={comment._id}
                                    className="divide-y"
                                >
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="w-96">
                                            <p
                                                onClick={() =>
                                                    getPostMutate(
                                                        comment.postId
                                                    )
                                                }
                                                className="line-clamp-2 cursor-pointer"
                                                title={comment.content}
                                            >
                                                {comment.content}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell className="text-center">
                                            <span className="font-medium text-gray-900 dark:text-gray-300">
                                                {comment.numberOfLikes}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </div>
                )}
                {postData?.length > 0 && (
                    <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                        <div className="flex justify-between items-center p-3 text-sm font-semibold">
                            <h1 className="text-center p-2">Recent posts</h1>
                            <a
                                href="/dashboard?tab=posts"
                                className="text-green-500 hover:underline"
                            >
                                See all
                            </a>
                        </div>
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Post image</Table.HeadCell>
                                <Table.HeadCell>Post Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                            </Table.Head>
                            {postData.map((post) => (
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img
                                                    src={post.image}
                                                    alt="user"
                                                    className="w-14 h-10 rounded-md bg-gray-500 object-cover"
                                                />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className="w-96">
                                            <Link
                                                className="font-medium text-gray-900 dark:text-gray-300"
                                                title={post.title}
                                                to={`/post/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className="w-5">
                                            {post.category
                                                .charAt(0)
                                                .toUpperCase() +
                                                post.category.slice(1)}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashDashboard;
