export const updateUser = async (userData) => {
    try {
        console.log(userData);
        const response = await fetch(`/api/users/${userData.userId}`, {
            method: "PUT",
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
        const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
        });

        const responseBody = await response.json();

        if (responseBody.status === "failure") {
            throw new Error(responseBody.message);
        }
        console.log(responseBody)

        return responseBody;
    } catch (err) {
        throw new Error(err.message);
    }
};
