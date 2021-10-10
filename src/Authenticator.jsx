import React from 'react';

import { useAuthentication } from './contexts/AuthenticationContext';

export default function Authenticator() {
    const authentication = useAuthentication();
    if(authentication.user) {
        const { user } = authentication;
        return (
            <div className='osirisAuthentication'>
                <img src={user.profile_url} alt={user.tag} className='osirisLoggedInUserImg' />
                You are logged in as {user.tag}
                <button onClick={authentication.logout}>Logout</button>
            </div>
        )
    } else {
        return (
            <div className='osirisAuthentication'>
                <button onClick={authentication.login}>Login</button>
            </div>
        );
    }
}