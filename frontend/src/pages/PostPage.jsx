import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { getPosts } from "../api/posts";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { format } from "date-fns";
import "../styles/MainPostContent.scss";

function PostPage() {
    const { postSlug } = useParams();

    const {
        data: post,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["post", postSlug],
        queryFn: () => getPosts({ slug: postSlug }),
    });

    const postData = post?.data?.posts[0];

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    if (isError) return <div>Something went wrong</div>;

    return (
        <main className="flex flex-col justify-center items-center p-3 max-w-6xl mx-auto min-h-screen">
            {postData ? (
                <>
                    <h1 className="text-3xl mt-8 p-3 text-center font-sans font-medium max-w-2xl mx-auto lg:text-4xl">
                        {postData.title}
                    </h1>
                    {postData.category !== "uncategorized" && (
                        <Link
                            to={`/search?category=${postData.category}`}
                            className="mx-auto mt-5"
                        >
                            <Button color="gray" size="xs" pill>
                                {postData.category}
                            </Button>
                        </Link>
                    )}
                    <img
                        src={postData.image}
                        alt={postData.title}
                        className="mt-10 p-3 max-h-[600px] w-full object-cover"
                    />
                    <div className="flex justify-between mx-auto w-full max-w-2xl text-xs border-b p-3 border-slate-500">
                        <span>{format(postData.createdAt, "dd/MM/yyyy")}</span>
                        <span className="italic">
                            {(() => {
                                const wordCount = postData.content.trim().split(/\s+/).length;
                                const readingTime = Math.ceil(wordCount / 200);
                                return readingTime > 1 
                                    ? `${readingTime} mins read`
                                    : "1 min read";
                            })()}
                        </span>
                    </div>
                    <section className="main-content mx-auto w-full max-w-2xl p-3">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: postData.content,
                            }}
                        />
                    </section>
                </>
            ) : (
                <p>Post not found</p>
            )}
        </main>
    );
}

export default PostPage;
