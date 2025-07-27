// types/admin-profile.ts
export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: "admin" | "super-admin" | "manager";
  lastLogin: Date;
  createdAt: Date;
};

export type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileUpdateForm = {
  name: string;
  // email: string;
  avatarFile?: File;
  phone?: string;
};
