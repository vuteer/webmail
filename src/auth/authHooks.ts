"use client"; 

import * as React from 'react';
import AuthContext from './context/AuthContext';

import {AuthKitError} from './auth-provider';

import {doSignIn, doSignOut} from './context/reducers/authReducers';

import {AuthStateUserObject, signInFunctionParams, AuthKitStateInterface} from './authTypes';

function isAuthenticated(auth: AuthKitStateInterface | null) : boolean {
    if (auth?.auth) {
      return new Date(auth.auth.expiresAt) > new Date();
    }
    return false;
  }


function useAuthUser(): () => AuthStateUserObject | null {
    const context = React.useContext(AuthContext);
    let authState = context?.authState || null; 
    if (context === null) {
      throw new
      AuthKitError('Auth Provider is missing. ' +
        'Please add the AuthProvider before Router');
    }
    return () => {
      if (isAuthenticated(authState)) {
        return context.authState.userState;
      } else {
        return null;
      }
    };
}


function useSignIn(): (signInConfig: signInFunctionParams) => boolean {
    const context = React.useContext(AuthContext);
    const authState = context?.authState || null; 
    if (context === null) {
      throw new
      AuthKitError('Auth Provider is missing. ' +
        'Please add the AuthProvider before Router');
    }
    return (signInConfig: signInFunctionParams): boolean => {
      const {
        token,
        tokenType,
        authState,
        expiresIn,
        refreshToken,
        refreshTokenExpireIn,
      } = signInConfig;
      const expTime = new Date(new Date().getTime() + expiresIn * 60 * 1000);
      if (authState?.isUsingRefreshToken) {
        // Using the power of refresh token
        if (!!refreshToken && !!refreshTokenExpireIn) {
          // refresh token params are provided
          // sign in with refresh token
          const refreshTokenExpireAt =
            new Date(new Date().getTime() + refreshTokenExpireIn * 60 * 1000);
          context.dispatch(doSignIn({
            auth: {
              token: token,
              type: tokenType,
              expiresAt: expTime,
            },
            userState: authState ? authState : null,
            refresh: {
              token: refreshToken,
              expiresAt: refreshTokenExpireAt,
            },
          }));
          return true;
        } else {
          // refresh token params are not provided
          // throw an error
          throw new AuthKitError('Make sure you given "refreshToken" and  ' +
            '"refreshTokenExpireIn" parameter');
        }
      } else {
        // Not using refresh token
        if (!!refreshToken && !!refreshTokenExpireIn) {
          // params are not expected but provided
          // throw an error
          throw new Error('The app doesn\'t implement \'refreshToken\' ' +
            'feature.\nSo you have to implement refresh token feature ' +
            'from \'AuthProvider\' before using it.');
        } else {
          // sign in without the refresh token
          context.dispatch(doSignIn({
            auth: {
              token: token,
              type: tokenType,
              expiresAt: expTime,
            },
            userState: authState ? authState : null,
            refresh: null,
          }));
          return true;
        }
      }
    };
}

function useSignOut(): () => (boolean) {
    /**
     *A constant c.
     *@kind constant
     */
    const context = React.useContext(AuthContext);
    if (context === null) {
      throw new
      AuthKitError('Auth Provider is missing. ' +
        'Please add the AuthProvider before Router');
    }
  
    return () => {
      try {
        if (context) {
          context.dispatch(doSignOut());
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    };
}

function useIsAuthenticated(): ()=>boolean {
    const context = React.useContext(AuthContext);
    if (context === null) {
      throw new
      AuthKitError('Auth Provider is missing. ' +
        'Please add the AuthProvider before Router');
    }
    return () => {
      if (!isAuthenticated(context?.authState)) {
        return false;
      } else {
        return true;
      }
    };
}


export {
    isAuthenticated,
    useAuthUser,
    useSignIn,
    useSignOut,
    useIsAuthenticated
  }