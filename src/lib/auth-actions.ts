"use server";

import { createClient } from "@/lib/supabase/server";

function friendlyAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }
  if (message.includes("already registered")) {
    return "Ya existe una cuenta con este correo.";
  }
  if (
    message.toLowerCase().includes("rate limit") ||
    message.includes("Too many")
  ) {
    return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  }
  return message;
}

export async function loginWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false as const, error: "Completa todos los campos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false as const, error: friendlyAuthError(error.message) };
  }

  return { success: true as const };
}

export async function registerWithPassword(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!fullName || !email || !password) {
    return {
      success: false as const,
      error: "Nombre, correo y contraseña son obligatorios.",
    };
  }

  if (password.length < 6) {
    return {
      success: false as const,
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
      },
    },
  });

  if (error) {
    return { success: false as const, error: friendlyAuthError(error.message) };
  }

  return { success: true as const, needsConfirmation: !data.session };
}
