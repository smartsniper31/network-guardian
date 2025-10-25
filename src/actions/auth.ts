"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { loginUser, signupUser } from "@/lib/services/network-service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: "Email ou mot de passe invalide.",
    };
  }

  try {
    await loginUser(validatedFields.data.email, validatedFields.data.password);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  redirect("/dashboard");
}

export async function signupAction(prevState: any, formData: FormData) {
   const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

   if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    if (errors.password) {
      return { error: "Le mot de passe doit contenir au moins 6 caractères." };
    }
    return {
      error: "Veuillez vérifier les informations saisies.",
    };
  }

  try {
    await signupUser(
        validatedFields.data.name,
        validatedFields.data.email,
        validatedFields.data.password
    );
  } catch(error: any) {
    return {
        error: error.message
    }
  }

  redirect("/dashboard");
}
