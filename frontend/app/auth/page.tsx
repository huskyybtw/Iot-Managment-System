"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Cpu } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="p-1.5 bg-primary rounded-lg">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              IoT Management Platform
            </h1>
          </div>
          <p className="text-muted-foreground text-xs">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-4 pb-4">
            <div className="relative bg-muted/50 rounded-xl p-1 border">
              <div
                className={`absolute top-1 bottom-1 bg-background rounded-lg shadow-sm transition-all duration-200 ease-in-out ${
                  isLogin
                    ? "left-1 right-1/2 mr-0.5"
                    : "right-1 left-1/2 ml-0.5"
                }`}
              />
              <div className="relative flex">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isLogin
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Logowanie
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    !isLogin
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Rejestracja
                </button>
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-xl font-bold">
                {isLogin ? "Witaj ponownie!" : "Dołącz do gry"}
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                {isLogin
                  ? "Wprowadź swoje dane aby się zalogować"
                  : "Wypełnij formularz aby utworzyć konto"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6">
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggle={() => setIsLogin(true)} />
            )}
          </CardContent>
        </Card>
        <div className="text-center mt-3">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}
