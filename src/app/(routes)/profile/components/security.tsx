// components/admin/profile/SecuritySettings.tsx
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { passwordSchema } from '@/lib/validations/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useToast } from '@/components/ui/use-toast';
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { passwordSchema } from "@/lib/validations/profile";
import { Separator } from "@/components/ui/separator";
import { createToast } from "@/utils/toast";
import { updateUser } from "@/lib/auth-client";
import { changePassword, signOut } from "@/lib/auth-client";

export function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      if (values.newPassword !== values.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      let res = await changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });

      // await updateUser({ firstPasswordChanged: true });

      if (res.error) throw new Error(res.error.message);

      createToast(
        "Success",
        "Password updated successfully, login again!",
        "success",
      );
      signOut();
      push("/login");
    } catch (error: any) {
      createToast("Error", error.message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          Update your account password. Make sure it&apos;s strong and secure.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2">
                  Current Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 text-muted-foreground"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2">New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 text-muted-foreground"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2">
                  Confirm New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 text-muted-foreground"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex pt-2">
            <Button type="submit" disabled={isLoading}>
              Updat{isLoading ? "ing" : "e"} Password{isLoading ? "..." : ""}
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">2FA Status</p>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" disabled={true}>
            Enable 2FA
          </Button>
        </div>
      </div>
    </div>
  );
}
