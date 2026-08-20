"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              PANELCREW<span className="text-amber-500">CUU</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#servicios"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Servicios
            </Link>
            <Link
              href="/#precios"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Precios
            </Link>
            <Link
              href="/partners"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Ser Partner
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Registrarse
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/#servicios" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Servicios</Link>
            <Link href="/#precios" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Precios</Link>
            <Link href="/partners" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Ser Partner</Link>
            <Link href="/auth/login" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Iniciar Sesión</Link>
            <Link href="/auth/register" className="block bg-amber-500 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMobileOpen(false)}>Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
