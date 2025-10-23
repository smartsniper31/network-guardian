"use server";

import { redirect } from "next/navigation";

export async function loginAction() {
  // In a real application, you would perform authentication here.
  // For this demo, we'll just simulate a delay and redirect.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  redirect("/dashboard");
}
