import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { 
  FileText, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Globe, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Invoicing",
    description: "Create professional invoices in seconds with our intuitive editor.",
  },
  {
    icon: Zap,
    title: "Fast Payments",
    description: "Accept local payments with Midtrans integration. Get paid faster than ever.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Your data is encrypted and backed up daily on secure infrastructure.",
  },
  {
    icon: BarChart3,
    title: "Income Analytics",
    description: "Track your earnings and visualize growth with real-time dashboards.",
  },
  {
    icon: Globe,
    title: "Multiple Currencies",
    description: "Bill clients in IDR, USD, or any currency they prefer.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Keep all your client contacts and history in one centralized place.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl xl:text-8xl">
              Invoicing <span className="text-blue-600 italic">redefined</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600 sm:mt-8 sm:text-xl">
              The modern way for freelancers and startups to track invoices,
              manage income, and stay on top of their business.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/register" className="sm:shrink-0">
                <Button
                  size="lg"
                  className="w-full px-8 shadow-lg shadow-blue-600/20 sm:w-auto"
                >
                  Start your 14-day free trial
                </Button>
              </Link>
              <Link href="/pricing" className="sm:shrink-0">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                >
                  View pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mt-12 px-0 sm:mt-20 sm:px-4">
            <div className="mx-auto max-w-5xl rounded-2xl bg-zinc-900 p-3 shadow-2xl ring-4 ring-blue-100 sm:rounded-3xl sm:p-4 sm:ring-8">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                <p className="px-4 text-center text-sm font-medium italic text-zinc-400 sm:text-base">
                  Beautiful dashboard preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-y border-zinc-100 bg-zinc-50 py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
              Everything you need to grow
            </h2>
            <p className="mt-3 text-base text-zinc-600 sm:mt-4 sm:text-lg">
              One platform to manage all your business financials.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mb-2 text-xl font-bold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                Rp0
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-600 sm:text-base">
                Monthly fees during trial
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                100%
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-600 sm:text-base">
                Encrypted data
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                &lt; 1 min
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-600 sm:text-base">
                To set up your account
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                24/7
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-600 sm:text-base">
                Priority support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center shadow-2xl shadow-blue-600/25 sm:rounded-[2.5rem] sm:px-12 sm:py-20 md:px-20">
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ready to take control of your{" "}
              <br className="hidden md:block" />
              business finances?
            </h2>
            <p className="mt-6 text-base text-blue-100 sm:mt-8 sm:text-lg">
              Join freelancers who trust InvoiceFlow. 14-day free trial, no
              credit card required.
            </p>
            <div className="mt-10 sm:mt-12">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full bg-white px-8 py-3 font-bold text-blue-700 hover:bg-zinc-100 sm:w-auto sm:px-10 sm:py-4"
                >
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                Invoice<span className="text-blue-600">Flow</span>
              </span>
            </div>
            <nav
              className="flex flex-wrap justify-center gap-6 text-sm text-zinc-600 sm:gap-8"
              aria-label="Footer"
            >
              <a
                href="#"
                className="transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
              >
                Contact
              </a>
            </nav>
            <p className="text-center text-sm text-zinc-500 md:text-right">
              © 2026 InvoiceFlow Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
