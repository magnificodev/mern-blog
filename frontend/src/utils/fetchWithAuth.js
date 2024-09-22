import { store } from "../redux/store";
import { signOutSuccess } from "../redux/user/userSlice";

export const fetchWithAuth = async (url, options = {}) => {
    try {
        options.method = options.method || "GET";
        const response = await fetch(url, options);
        
        if (response.status === 401) {
            const refreshResponse = await fetch("/api/v1/auth/refresh", {
                method: "POST",
            });

            if (refreshResponse.ok) {
                return await fetch(url, options);
            }
            else {
                store.dispatch(signOutSuccess());
                throw new Error("Session expired, please sign in again.");
            }
        }

        return response;
    }   
    catch (err) {
        throw new Error(err.message);
    }
};
