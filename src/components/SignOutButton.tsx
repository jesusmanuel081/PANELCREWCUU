"use client";

export default function SignOutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
      >
        Cerrar Sesión
      </button>
    </form>
  );
}
