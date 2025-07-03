"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const One_Week = 60 * 60 * 24 * 7

// Define the parameters for the sign-up function
export async function signUp(params: SignUpParams) {
    const { uid, email, name } = params;

    try {

        const userRecord = await db.collection("users").doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in instead.",
            }
        } else {
            await db.collection("users").doc(uid).set({
                name,
                email,
            });

            return {
                success: true,
                message: "User signed up successfully. Please sign in.",
            }
        }
        
    } catch (error: any) {
        console.error("Error during sign up:", error);

        if(error.code === "auth/email-already-in-use") {
            return {
                success: false,
                message: "Email is already in use. Please try another email.",
            }
        }

        return {
            success: false,
            message: "An error occurred during sign up. Please try again later.",
        }
    }
}



// Define the parameters for the sign-in function
export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {

        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: "User does not exist. Please sign up first.",
            }
        }

        await setSessionCookie(idToken);
        
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "An error occurred during sign in. Please try again later.",
        }
    }
}


// function to set session cookie after sign in or sign up
// This function will be called after successful sign in or sign up
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: One_Week * 1000, // 7 days
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: One_Week, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    })
}


// Function to get the current user from the session cookie
// This function will be used to get the current user in the server components
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;

    if(!sessionCookie) return null;

    try {

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}



export async function isAuthenticated() {
    const user = await getCurrentUser();

    // the double negation or exclamation mark (!!) converts the existence of the user object to a boolean value
    // If user is null, it will return false, otherwise it will return true
    return !!user;
}