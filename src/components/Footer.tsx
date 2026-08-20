import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="font-bold text-xl text-white">
                PANELCREW<span className="text-amber-500">CUU</span>
              </span>
            </div>
            <p className="text-sm">
              Servicios profesionales de limpieza de paneles solares en Chihuahua.
              Maximiza la eficiencia de tu inversión energética.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#servicios" className="hover:text-white transition-colors">Limpieza Residencial</Link></li>
              <li><Link href="/#servicios" className="hover:text-white transition-colors">Limpieza Comercial</Link></li>
              <li><Link href="/#precios" className="hover:text-white transition-colors">Cotizaciones B2B</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Portal de Cliente</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">Ser Partner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Chihuahua, Chihuahua, México</li>
              <li>Tel: (614) 123-4567</li>
              <li>hola@panelcrewcuu.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PANELCREWCUU. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
