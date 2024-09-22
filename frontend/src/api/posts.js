import { fetchWithAuth } from "../utils/fetchWithAuth";

export const createPost = async (postData) => {
    try {
        const response = await fetchWithAuth("/api/v1/posts", {
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

export const getPosts = async ({
    userId,
    skip,
    limit,
    order,
    category,
    slug,
    searchTerm,
} = {}) => {
    try {
        console.log("searchTerm", searchTerm);
        console.log("category", category);
        console.log("order", order);
        const url = new URL("/api/v1/posts", window.location.origin);

        const params = {
            userId,
            skip,
            limit,
            order,
            category,
            slug,
            searchTerm,
        };

        Object.keys(params).forEach((key) => {
            if (!!params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetchWithAuth(url);

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
        const response = await fetchWithAuth(`/api/v1/posts/${postId}`);

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
        const response = await fetchWithAuth(`/api/v1/posts/${postId}`, {
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
        const response = await fetchWithAuth(`/api/v1/posts/${postId}`, {
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
