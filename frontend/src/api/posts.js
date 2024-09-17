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

export const getPosts = async ({ pageParam = 1, limit = 5, userId } = {}) => {
    try {
        const url = new URL("/api/posts", window.location.origin);

        if (userId !== undefined) {
            url.searchParams.append("userId", userId);
        }
        if (pageParam !== undefined && limit !== null) {
            url.searchParams.append("skip", (pageParam - 1) * limit);
        }
        if (limit !== null) {
            url.searchParams.append("limit", limit);
        }

        const response = await fetch(url);

        const responseBody = await response.json();
        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const getPost = async (postId) => {
    try {
        const response = await fetch(`/api/posts/${postId}`);
        const responseBody = await response.json();
        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }
        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const updatePost = async ({ postId, postData }) => {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: "PUT",
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
