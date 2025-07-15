import { signIn, forgetPassword } from "@/lib/auth-client";
import { createToast } from "@/utils/toast";

const handleSubmit = async (
  data: any,
  screen: string,
  setLoading: React.Dispatch<boolean>,
  push: (path: string) => void,
) => {
  try {
    let res;
    setLoading(true);
    if (screen === "login") {
      // res = await login(data);
      res = await signIn.email({ email: data.email, password: data.password });
      if (res.error) throw new Error(res.error.message);
      if (res) {
        createToast("Success", "Login successful", "success");
        push("/?sec=inbox");
      }
    } else if (screen === "forgot") {
      // hanndle forgot password from backend first
      // res = await forgotPassword({ email: data.email });
      // if (res) {
      //   createToast("success", "Password sent to your phone!");
      //   push("/auth/login");
      // }
    }
  } catch (error: any) {
    console.error(error);
    createToast("Error", error.message || "An error occurred", "danger");
  } finally {
    setLoading(false);
  }
};

export { handleSubmit };
