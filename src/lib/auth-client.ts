// import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
// import { multiSessionClient } from "better-auth/client/plugins";

export const {
  signIn,
  signOut,
  signUp,
  forgetPassword,
  useSession,
  updateUser,
  listSessions,
  changePassword,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [],
});
