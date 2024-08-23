import { Label, TextInput, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col p-3 max-w-3xl mx-auto items-center md:flex-row gap-5">
                <div className="text-left w-full">
                    <Link to="/" className="font-bold dark:text-white text-4xl">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            {"Magnificodev's"}
                        </span>
                        Blog
                    </Link>
                    <p className="text-sm mt-5">
                        This is a demo project. You can sign up with your email
                        and password or with Google.
                    </p>
                </div>
                <div className="w-full"> 
                    <form action="#" className="flex flex-col gap-4">
                        <div>
                            <Label value="Your username" htmlFor="username" />
                            <TextInput type="text" id="username" />
                        </div>
                        <div>
                            <Label value="Your email" htmlFor="email" />
                            <TextInput
                                type="text"
                                id="email"
                                placeholder="example@gmail.com"
                            />
                        </div>
                        <div>
                            <Label value="Your password" htmlFor="password" />
                            <TextInput
                                type="password"
                                id="password"
                                placeholder="******"
                            />
                        </div>
                        <Button gradientDuoTone="purpleToPink" type="submit" >
                            Sign Up
                        </Button>
                    </form>
                    <div className="text-sm flex gap-1 mt-5">
                        <span>Have an account?</span>
                        <Link to="sign-in" className="text-blue-500">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
