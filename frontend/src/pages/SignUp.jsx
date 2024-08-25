import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {
    usernameValidationObj,
    emailValidationObj,
    passwordValidationObj,
} from "../validation/SignUpValidation";
import { signUp } from "../api/auth";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();

    const { mutate, error, isError, isPending } = useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            navigate("/");
            console.log(data.message);
        },
    });

    const onSubmit = (userData) => {
        mutate(userData);
    };

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
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <Label value="Your username" htmlFor="username" />
                            <TextInput
                                type="text"
                                id="username"
                                {...register("username", usernameValidationObj)}
                                color={errors.username?.message && "failure"}
                                helperText={
                                    <>
                                        <span className="font-normal">
                                            {errors.username?.message}
                                        </span>
                                    </>
                                }
                            />
                        </div>
                        <div>
                            <Label value="Your email" htmlFor="email" />
                            <TextInput
                                type="email"
                                id="email"
                                className="focus:placeholder-transparent"
                                placeholder="example@gmail.com"
                                {...register("email", emailValidationObj)}
                                color={errors.email?.message && "failure"}
                                helperText={
                                    <>
                                        <span className="font-normal">
                                            {errors.email?.message}
                                        </span>
                                    </>
                                }
                            />
                        </div>
                        <div>
                            <Label value="Your password" htmlFor="password" />
                            <TextInput
                                type="password"
                                id="password"
                                {...register("password", passwordValidationObj)}
                                color={errors.password?.message && "failure"}
                                helperText={
                                    <>
                                        <span className="font-normal">
                                            {errors.password?.message}
                                        </span>
                                    </>
                                }
                            />
                        </div>
                        <Button
                            gradientDuoTone="purpleToPink"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Signing up...</span>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                    <div className="text-sm flex gap-1 mt-5">
                        <span>Have an account?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Sign in
                        </Link>
                    </div>
                    {isError && (
                        <Alert className="mt-5" color="failure">
                            {error.message}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
