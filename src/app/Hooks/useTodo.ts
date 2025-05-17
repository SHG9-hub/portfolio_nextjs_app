import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase/firebase";
import { signInUser, signOutUser, signUpUser } from "../lib/firebase/firebaseauth";
import { enqueueSnackbar, useSnackbar } from "notistack"
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthAction = {
    handleSignIn: (data: { email: string; password: string }) => Promise<void>;
    handleSignUp: (data: { email: string; password: string }) => Promise<void>;
    handleSignOut: () => Promise<void>;
    isSubmittingLoading: boolean;
}

type AuthUserState = {
    user: NonNullable<ReturnType<typeof useAuthState>[0]>;
}

export const useTodo = (): {
    authAction: AuthAction;
    authUserState: AuthUserState;
} => {
    const [user] = useAuthState(auth);
    const [isSubmittingLoading, setIsSubmittingLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (data: { email: string; password: string }) => {

        setIsSubmittingLoading(true);
        const user = await signInUser(data.email, data.password);
        setIsSubmittingLoading(false);

        if (!user) {
            enqueueSnackbar('サインインに失敗しました。もう一度お試しください。', { variant: 'error' });
            return;
        }

        enqueueSnackbar('サインインしました！', { variant: 'success' });
        router.push("/dashboard");
    };

    const handleSignUp = async (data: { email: string; password: string }) => {

        setIsSubmittingLoading(true);
        const user = await signUpUser(data.email, data.password);
        setIsSubmittingLoading(false);

        if (!user) {
            enqueueSnackbar('サインアップに失敗しました。もう一度お試しください。', { variant: 'error' });
            return;
        }

        enqueueSnackbar('サインアップしました！', { variant: 'success' });
        router.push("/dashboard");
    };

    const handleSignOut = async () => {

        setIsSubmittingLoading(true);
        const isSignOutSuccessful = await signOutUser();
        setIsSubmittingLoading(false);

        if (!isSignOutSuccessful) {
            enqueueSnackbar('サインアウト中にエラーが発生しました。', { variant: 'error' });
            return;
        }

        enqueueSnackbar('サインアウトしました！', { variant: 'success' });
        router.push("/")
    };

    return {
        authAction: {
            handleSignUp,
            handleSignIn,
            handleSignOut,
            isSubmittingLoading,
        },
        authUserState: {
            user: user!,
        }
    };
}