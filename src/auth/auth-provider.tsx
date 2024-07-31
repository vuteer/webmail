"use client";

import * as React from "react";
import AuthContext from "./context/AuthContext";
import TokenObject from "./authToken";
import { AuthProviderProps } from "./authTypes";
import { authReducer, doRefresh } from "./context/reducers/authReducers";

/**
 * @class
 * @name AuthKitError
 * @extends Error
 *
 * General Auth kit error class
 */
export class AuthKitError extends Error {
  /**
   * @constructor
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
  }
}

/**
 * AuthProvider - The Authentication Context Provider
 *
 * @param children
 * @param authStorageName
 * @param cookieDomain
 * @param cookieSecure
 *
 * @return Functional Component
 */
const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  children,
  authType,
  authName,
  cookieDomain = process.env.NEXT_PUBLIC_DOMAIN,
  cookieSecure = process.env.NEXT_PUBLIC_PROTOCOL === "https",
  refresh,
}) => {
  if (authType === "cookie") {
    if (!cookieDomain) {
      throw new AuthKitError(
        "authType 'cookie' " +
          "requires 'cookieDomain' and 'cookieSecure' " +
          "props in AuthProvider"
      );
    }
  }

  const refreshTokenName = refresh ? `${authName}_refresh` : null;

  const tokenObject = new TokenObject(
    authName,
    authType,
    refreshTokenName,
    cookieDomain,
    cookieSecure
  );

  const [authState, dispatch] = React.useReducer(
    authReducer,
    tokenObject.initialToken()
  );

  // uncomment this is you are using refresh tokens
  // if (refresh) {
  //   useInterval(
  //       () => {
  //         refresh
  //           .refreshApiCallback({
  //             authToken: authState.auth?.token,
  //             authTokenExpireAt: authState.auth?.expiresAt,
  //             authUserState: authState.userState,
  //             refreshToken: authState.refresh?.token,
  //             refreshTokenExpiresAt: authState.refresh?.expiresAt,
  //           })
  //           .then((result) => {
  //             // IF the API call is successful then refresh the AUTH state
  //             if (result.isSuccess) {
  //               // store the new value using the state update
  //               dispatch(doRefresh(result));
  //             }
  //             else {
  //               // do something in future
  //             }
  //           })
  //           .catch(()=>{
  //             // do something in future
  //           });
  //       },
  //     authState.isSignedIn ? refresh.interval : null,
  //   );
  // }

  React.useEffect(() => {
    tokenObject.syncTokens(authState);
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Default prop for AuthProvider
// AuthProvider.defaultProps = {
//   cookieDomain: window.location.hostname,
//   cookieSecure: window.location.protocol === 'https:',
// };

export default AuthProvider;
