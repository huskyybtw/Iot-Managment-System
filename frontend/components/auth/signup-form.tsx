import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Lock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupFormData, signupSchema } from "@/app/auth/auth-schema";
import { useRouter } from "next/navigation";
import { useRegisterAuthRegisterPost } from "@/lib/auth/auth";

interface SignupFormProps {
  onToggle: () => void;
}

export function SignupForm({ onToggle }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });
  const router = useRouter();
  const signupMutation = useRegisterAuthRegisterPost();

  const onSubmit = async (data: SignupFormData) => {
    const payload = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phone_number: data.phoneNumber,
    };
    signupMutation.mutate(
      { data: payload },
      {
        onSuccess: (response) => {
          const token = response.data.access_token;
          if (token) {
            localStorage.setItem("accessToken", token);
            toast.success("Account created successfully!");
            reset();
            router.push("/dashboard");
          } else {
            toast.error("No token in response.");
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.detail ||
              "Registration failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardContent className="space-y-3 px-6 pb-6">
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
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="pl-10 h-11 bg-background border-2 border-border focus:border-primary"
              autoComplete="tel"
              {...register("phoneNumber")}
            />
          </div>
          {touchedFields?.phoneNumber && errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber.message}
            </p>
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
              autoComplete="new-password"
              {...register("password")}
            />
          </div>
          {touchedFields?.password && errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              className="pl-10 h-11 bg-background border-2 border-border focus:border-primary"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </div>
          {touchedFields?.confirmPassword && errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          className="w-full h-11 font-semibold mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          Register
        </Button>
        <div className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-primary hover:underline font-medium"
          >
            Log in
          </button>
        </div>
      </CardContent>
    </form>
  );
}
