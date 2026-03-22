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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
              Invoicing <span className="text-blue-600 italic">Redefined.</span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The modern way for freelancers and startups to track invoices, 
              manage income, and stay on top of their business.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6">
              <Link href="/register">
                <Button size="lg" className="px-8 py-4 shadow-xl shadow-blue-200">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-4">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-20 relative px-4">
             <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl p-4 shadow-2xl ring-8 ring-blue-50">
               <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 aspect-[16/9] flex items-center justify-center">
                 <p className="text-gray-400 font-medium italic">Beautiful Dashboard Preview Here</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to grow</h2>
            <p className="mt-4 text-gray-600 text-lg">One platform to manage all your business financials.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div key={feature.title} className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="text-center">
               <p className="text-4xl font-extrabold text-blue-600">Rp0</p>
               <p className="text-gray-500 mt-2 font-medium">Monthly Fees During Trial</p>
             </div>
             <div className="text-center">
               <p className="text-4xl font-extrabold text-blue-600">100%</p>
               <p className="text-gray-500 mt-2 font-medium">Encrypted Data</p>
             </div>
             <div className="text-center">
               <p className="text-4xl font-extrabold text-blue-600">&lt; 1min</p>
               <p className="text-gray-500 mt-2 font-medium">To Setup Your Account</p>
             </div>
             <div className="text-center">
               <p className="text-4xl font-extrabold text-blue-600">24/7</p>
               <p className="text-gray-500 mt-2 font-medium">Priority Support</p>
             </div>
           </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
              Ready to take control of your <br className="hidden md:block" /> business finances?
            </h2>
            <p className="mt-8 text-blue-100 text-lg opacity-90">
              Join thousands of freelancers who trust InvoiceFlow. 14-day free trial, no credit card required.
            </p>
            <div className="mt-12">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-10 py-4 font-bold text-blue-600 bg-white hover:bg-gray-100">
                  Step Into Modern Invoicing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Invoice<span className="text-blue-600">Flow</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 InvoiceFlow Inc. Built for winners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
