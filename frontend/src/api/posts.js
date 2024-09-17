export const createPost = async (postData) => {
    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const getPosts = async ({ pageParam, userId, limit = 5 }) => {
    try {
        const response = await fetch(
            `/api/posts?userId=${userId}&skip=${
                (pageParam - 1) * limit
            }&limit=${limit}`
        );

        const responseBody = await response.json();
        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};
