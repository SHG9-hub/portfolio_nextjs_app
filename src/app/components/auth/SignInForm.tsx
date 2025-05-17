"use client";

import { useTodo } from "@/app/Hooks/useTodo";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email({ message: "無効なメールアドレス形式です。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const { authAction } = useTodo();

  if (authAction.isSubmittingLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(async (data: SignInFormValues) => {
        await authAction.handleSignIn(data);
      })}
      data-testid="signin-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Sign in
      </Typography>
      <TextField
        label="Email"
        type="email"
        id="signin-email"
        {...register("email")}
        autoComplete="username"
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        id="signin-password"
        {...register("password")}
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
      />
      <Button type="submit" variant="contained">
        サインイン
      </Button>
    </Box>
  );
};

export default SignInForm;
