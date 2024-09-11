import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Label, TextInput, Button, Spinner, Alert } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { emailValidationObj, passwordValidationObj } from "../validation/FormValidation";
import { signIn } from "../api/auth";
import OAuth from "../components/OAuth";
import { signInSuccess } from "../redux/user/userSlice";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { mutate, error, isError, isPending } = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            dispatch(signInSuccess(data.data.user));
            navigate("/");
        },
    });

    const onSubmit = (userData) => {
        mutate(userData);
    };
    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col p-3 max-w-3xl mx-auto items-center md:flex-row gap-5 md:gap-8">
                <div className="w-full">
                    <Link to="/" className="font-bold dark:text-white text-4xl">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            {"Magnificodev's"}
                        </span>
                        Blog
                    </Link>
                    <p className="text-sm mt-5">
                        This is a demo project. You can sign in with your email and password or with
                        Google.
                    </p>
                </div>
                <div className="w-full">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label value="Your email" htmlFor="email" />
                            <TextInput
                                type="email"
                                id="email"
                                placeholder="example@gmail.com"
                                {...register("email", emailValidationObj)}
                                color={errors.email && "failure"}
                                helperText={
                                    errors.email && (
                                        <>
                                            <span className="font-normal">
                                                {errors.email?.message}
                                            </span>
                                        </>
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label value="Your password" htmlFor="password" />
                            <TextInput
                                type="password"
                                id="password"
                                placeholder="******"
                                {...register("password", passwordValidationObj)}
                                color={errors.password && "failure"}
                                helperText={
                                    errors.password && (
                                        <>
                                            <span className="font-normal">
                                                {errors.password?.message}
                                            </span>
                                        </>
                                    )
                                }
                            />
                        </div>
                        <Button gradientDuoTone="purpleToPink" type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Signing up...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="text-sm flex gap-1 mt-5">
                        <span>Don't have an account?</span>
                        <Link to="/sign-up" className="text-blue-500">
                            Sign up
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

export default SignIn;
