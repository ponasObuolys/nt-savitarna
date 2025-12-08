import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICE_TYPES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              1P
            </div>
            <span className="text-lg font-semibold text-gray-900">Savitarna</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Prisijungti
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Registruotis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nekilnojamojo turto vertinimo{" "}
              <span className="text-primary">savitarna</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Užsisakykite profesionalų nekilnojamojo turto vertinimą internetu.
              Greita, patogu ir patikima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Pradėti nemokamai</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Prisijungti</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mūsų paslaugos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pasirinkite jums tinkamą vertinimo paslaugą
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {Object.entries(SERVICE_TYPES).map(([key, service]) => (
              <Card key={key} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{service.nameLt}</CardTitle>
                  <CardDescription>{service.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {service.price > 0 ? `${service.price} €` : "Individuali"}
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/checkout?service=${key}`}>
                      Užsakyti
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Greita</h3>
              <p className="text-gray-600">Automatinis vertinimas per kelias minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Patikima</h3>
              <p className="text-gray-600">Sertifikuoti vertintojai su patirtimi</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Prieinama kaina</h3>
              <p className="text-gray-600">Konkurencingos kainos rinkoje</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white text-xs font-bold">
                1P
              </div>
              <span className="text-sm text-gray-600">
                © {new Date().getFullYear()} 1Partner. Visos teisės saugomos.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="https://www.1partner.lt" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                1Partner.lt
              </a>
              <a href="https://www.vertintojas.pro" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                Vertintojas.pro
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
