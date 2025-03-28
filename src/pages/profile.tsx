import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (isAuthenticated && user) {
        return (
            <div className="bg-mint-500 p-4">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        );
    } else {
        return (
            <div className="bg-mint-500 p-4">
                <h2>Not Logged In</h2>
            </div>
        );
    }
};

export default Profile;