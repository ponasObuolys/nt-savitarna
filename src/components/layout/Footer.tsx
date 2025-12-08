export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">
              1P
            </div>
            <span className="text-sm text-gray-600">
              © {currentYear} 1Partner. Visos teisės saugomos.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.vertintojas.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              vertintojas.pro
            </a>
            <a
              href="mailto:info@1partner.lt"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              info@1partner.lt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
