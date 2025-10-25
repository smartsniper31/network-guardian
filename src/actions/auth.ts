
"use server";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("L'email est invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
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
    // Return the first error found
    for (const key in errors) {
        if (errors[key as keyof typeof errors]) {
            return { data: null, error: errors[key as keyof typeof errors]![0] };
        }
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

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const emailSchema = z.object({ email: z.string().email("L'email est invalide.") });
  const validatedFields = emailSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: "Veuillez saisir une adresse email valide.", success: null };
  }

  return {
    error: null,
    success: "Si un compte est associé à cet email, nous vous montrerons comment le récupérer."
  }
}

