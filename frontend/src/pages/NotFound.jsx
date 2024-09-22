import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center flex flex-col items-center">
                <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-400 mb-6">
                    Oops! Page Not Found
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </p>
                <Link to="/">
                    <Button
                        gradientDuoTone="purpleToPink"
                        size="lg"
                    >
                        Go Back Home
                    </Button>
                </Link>
            </div>
            <div className="mt-4">
                <svg
                    className="w-64 h-64 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
};

export default NotFound;
