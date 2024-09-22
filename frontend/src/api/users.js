import { fetchWithAuth } from "../utils/fetchWithAuth";

export const getUsers = async ({ skip, limit, order } = {}) => {
    try {
        const url = new URL("/api/v1/users", window.location.origin);

        const params = { skip, limit, order };

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

export const getUser = async (userId) => {
    try {
        const response = await fetchWithAuth(`/api/v1/users/${userId}`);
        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const updateUser = async ({ userId, userData }) => {
    try {
        const response = await fetchWithAuth(`/api/v1/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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

export const deleteUser = async (userId) => {
    try {
        const response = await fetchWithAuth(`/api/v1/users/${userId}`, {
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
