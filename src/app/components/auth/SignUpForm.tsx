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

const signUpSchema = z.object({
  email: z.string().email({ message: "無効なメールアドレス形式です。" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上である必要があります。" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });
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
      onSubmit={handleSubmit(async (data: SignUpFormValues) => {
        await authAction.handleSignUp(data);
      })}
      data-testid="signup-form"
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
        Sign Up
      </Typography>
      <TextField
        label="Email"
        type="email"
        id="signup-email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        autoComplete="username"
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        id="signup-password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        autoComplete="current-password"
        required
        fullWidth
      />
      <Button type="submit" variant="contained">
        サインアップ
      </Button>
    </Box>
  );
};

export default SignUpForm;
