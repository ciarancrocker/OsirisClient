import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import { UserProvider } from "./contexts/UserContext";

export default function ApplicationProviders({ children }) {
    return (
        <AuthenticationProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </AuthenticationProvider>
    );
};