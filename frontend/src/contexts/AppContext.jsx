import { useState, createContext, useContext, useEffect } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let toastTimeout;
        if (toast) {
            toastTimeout = setTimeout(() => {
                setToast(null);
            }, 3000);
        }

        return () => {
            clearTimeout(toastTimeout);
        };
    }, [toast]);

    return (
        <AppContext.Provider
            value={{
                showToast: (toastObj) => setToast(toastObj),
            }}
        >
            {toast && (
                <Toast className="fixed bottom-5 right-5 z-50">
                    {toast.type === "success" ? (
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                    ) : (
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                    )}
                    <div className="ml-3 text-sm font-normal">
                        {toast.message}
                    </div>
                    <Toast.Toggle />
                </Toast>
            )}
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
