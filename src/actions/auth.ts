
"use server";

import { z } from "zod";

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
      data: null,
      error: "Email ou mot de passe invalide.",
    };
  }

  return {
    data: validatedFields.data,
    error: null,
  };
}

export async function signupAction(prevState: any, formData: FormData) {
   const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

   if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    if (errors.password) {
      return { data: null, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }
    return {
      data: null,
      error: "Veuillez vérifier les informations saisies.",
    };
  }
  
  return {
      data: validatedFields.data,
      error: null,
  }
}
