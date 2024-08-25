export const signUp = async (userData) => {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const responseBody = await response.json();

    if (!(responseBody.status === 'success')) {
        throw new Error(responseBody.message);
    }

    return responseBody
};