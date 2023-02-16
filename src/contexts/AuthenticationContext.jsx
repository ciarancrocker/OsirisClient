import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../app_config";

import { openAuthenticationPopup, listenForAuthentication } from "../util/popupUtils";

const AuthenticationContext = createContext();

function AuthenticationProvider(props) {
    const [jwt, setJwt] = useState(window.localStorage.getItem('jwt'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            if(jwt) {
                try {
                    const userRequest = new Request(`${API_URL}/api/users/@me`, {
                        headers: {
                            'Authorization': `Bearer ${jwt}`,
                        },
                    });
                    const userFetch = await fetch(userRequest);
                    const user = await userFetch.json();
                    setUser(user);
                } catch (e) {
                    setUser(null);
                    setJwt(null);
                }
            } else {
                setUser(null);
            }
        })();
    }, [jwt]);

    async function login() {
        const loginPopup = openAuthenticationPopup();
        const jwt = await listenForAuthentication(loginPopup);
        window.localStorage.setItem('jwt', jwt);
        setJwt(jwt);
    }

    async function logout() {
        window.localStorage.removeItem('jwt');
        setJwt(null);
    }

    return (
        <AuthenticationContext.Provider value={{
            jwt,
            user,
            login,
            logout,
        }} {...props} />
    )
};

const useAuthentication = () => useContext(AuthenticationContext);

export { AuthenticationProvider, useAuthentication };