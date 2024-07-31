"use client"; 

import React from 'react'; 
import { AuthActions } from './actions/authActions';

interface AuthContextInterface {
    authState: {
        auth: {
            token: string; 
            type: string; 
            expiresAt: Date
        } | null, 
        refresh: {
            token: string; 
            expiresAt: Date;
        } | null, 
        userState: {[x: string]: any} | null,
        isSignedIn: boolean;  
    },
    dispatch: React.Dispatch<AuthActions>;
}

const AuthContext = React.createContext<AuthContextInterface | null>(null);
const AuthContextConsumer = AuthContext.Consumer;
export {AuthContextConsumer};

export default AuthContext;