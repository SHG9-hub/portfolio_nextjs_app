import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "./firebase";

const signUpUser = async (email: string, password: string): Promise<User | undefined> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch {
        return;
    }
}

const signInUser = async (email: string, password: string): Promise<User | undefined> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch {
        return;
    }
}

const signOutUser = async (): Promise<boolean> => {
    try {
        await signOut(auth);
        return true;
    } catch {
        return false;
    }
}

export { signUpUser, signInUser, signOutUser }