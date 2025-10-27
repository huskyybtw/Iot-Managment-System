import * as yup from "yup";
import type { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const settingsSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
});

export type SettingsFormData = InferType<typeof settingsSchema>;
