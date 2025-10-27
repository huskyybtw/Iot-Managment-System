import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, loginSchema } from "@/app/auth/auth-schema";
import { useRouter } from "next/navigation";
import { useLoginAuthLoginPost } from "@/lib/auth/auth";
import { toast } from "sonner";

interface LoginFormProps {
  onToggle: () => void;
}

export function LoginForm({ onToggle }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const loginMutation = useLoginAuthLoginPost();
  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          const token = response.data.access_token;
          if (token) {
            localStorage.setItem("accessToken", token);
            toast.success("Logged in successfully!");
            reset();
            router.push("/auth/dashboard");
          } else {
            toast.error("No token in response.");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.detail || "Login failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="pl-10 h-11 bg-background border-2 border-border focus:border-primary"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {touchedFields?.email && errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            className="pl-10 h-11 bg-background border-2 border-border focus:border-primary"
            autoComplete="current-password"
            {...register("password")}
          />
        </div>
        {touchedFields?.password && errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        className="w-full h-11 font-semibold mt-4"
        type="submit"
        disabled={isSubmitting}
      >
        Log in
      </Button>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
