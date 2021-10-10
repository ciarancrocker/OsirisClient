import { createContext, useContext } from "react";
import { useAuthentication } from "./AuthenticationContext";

const UserContext = createContext();

function UserProvider(props) {
    return (
        <UserContext.Provider value={useAuthentication().user} {...props} />
    )
};

const useUser = () => useContext(UserContext);

export {UserProvider, useUser};