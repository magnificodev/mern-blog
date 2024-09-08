import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="mx-auto max-w-lg p-3 w-full">
            <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
            <form action="" className="flex flex-col gap-4">
                <div className="w-32 h-32 self-center cursor-pointer">
                    <img
                        src={currentUser.profilePic}
                        alt="user"
                        className="rounded-full w-full h-full border-8 border-[lightgray] object-cover shadow-md"
                    />
                </div>
                <TextInput
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type="text"
                    id="password"
                    placeholder="Password"
                    defaultValue={currentUser.password}
                />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="flex justify-between text-red-500 mt-5">
                <span className="cursor-pointer">Delete Account</span> 
                <span className="cursor-pointer">Sign out</span> 
            </div>
        </div>
    );
};

export default DashProfile;
