import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Nieprawidłowy email")
    .required("Email jest wymagany"),
  password: yup
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
});

export const signupSchema = yup.object({
  email: yup
    .string()
    .email("Nieprawidłowy email")
    .required("Email jest wymagany"),
  phoneNumber: yup
    .string()
    .matches(/^(\+?\d{1,3}[- ]?)?\d{10}$/, "Nieprawidłowy numer telefonu")
    .required(),
  password: yup
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Hasła muszą być takie same")
    .required("Potwierdzenie hasła jest wymagane"),
});

export type SignupFormData = yup.InferType<typeof signupSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
