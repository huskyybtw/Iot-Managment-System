"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Lock, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePatchMeAuthMePatch } from "@/lib/api/auth/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  settingsSchema,
  SettingsFormData,
} from "@/lib/validators/settings-schema";
import { useAuthContext } from "@/lib/providers/authProvider";

export function SettingsDialog() {
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      email: user?.email || "",
      phone: user?.password || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutateAsync, isPending } = usePatchMeAuthMePatch();

  const onSubmit = async (formData: SettingsFormData) => {
    try {
      const payload = {
        email: formData.email,
        phone_number: formData.phone,
        password: formData.newPassword ?? "",
      };
      const response = await mutateAsync({ data: payload });
      if (response?.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update settings");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account preferences and security
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Profile Information</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-9"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-xs text-destructive">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123456789"
                    className="pl-9"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className="text-xs text-destructive">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Security</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="current-password"
                    type="password"
                    className="pl-9"
                    {...register("currentPassword")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-9"
                    {...register("newPassword")}
                  />
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-end gap-2 pt-4"
          >
            <Button type="submit" disabled={isPending}>
              Save Changes
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
