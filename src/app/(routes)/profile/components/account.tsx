// components/admin/profile/AccountSettings.tsx
"use client";

import { AdminProfile, ProfileUpdateForm } from "@/types/profile";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations/profile";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { convertToWebP } from "@/utils/conver-to-webgp";
import { uploadToCloudinary } from "@/lib/upload-image";
import { createToast } from "@/utils/toast";
import { updateUser } from "@/lib/auth-client";

export function AccountSettings({ profile }: { profile: AdminProfile }) {
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.image || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState<File | null>(null);

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || "",
      avatarFile: undefined,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUploaded(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<ProfileUpdateForm> = async (
    values: ProfileUpdateForm,
  ) => {
    try {
      setIsLoading(true);
      let imgUrl: any;

      if (avatarUploaded) {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(avatarUploaded, options);
        const webpFile = await convertToWebP(compressedFile);
        imgUrl = await uploadToCloudinary(webpFile, `mj/admin/${profile.id}`);
      }

      const update: Partial<ProfileUpdateForm> & { image?: string } = {};

      if (imgUrl) update.image = imgUrl;
      if (values.name !== profile.name) update.name = values.name;
      if (values.phone !== profile.phone) update.phone = values.phone;

      if (!Object.keys(update).length) {
        createToast("Error", "Nothing to update!", "danger");
        return;
      }

      await updateUser(update);
      createToast("Success", "Profile updated successfully!", "success");
      window.location.reload();
    } catch (error) {
      createToast("Error", "Error occurred while updating!", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90"
              >
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <PencilIcon className="h-4 w-4" />
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>JPG, GIF, PNG, or WebP. Max 2MB.</p>
              <p>Recommended size: 200x200px</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold my-2">Phone</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="+254710 222 333" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex ">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
