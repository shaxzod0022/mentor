import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Users,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Mentor<span className="text-indigo-600">Pro</span>
            </span>
          </div>
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
          >
            Kirish
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 text-sm font-medium">
              <Star size={16} className="fill-indigo-600" />
              <span>O'zbekistondagi 1-raqamli mentorlik platformasi</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Ustoz-Shogirt: <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                Kelajak sari birga
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Raqamlashtirilgan mentorlik markazi orqali bilimingizni ulashing
              yoki tajribali mutaxassislardan o'rganing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-2xl active:scale-95"
              >
                Hoziroq boshlang
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            {/* Decorative shapes */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-200/50 rounded-full blur-3xl" />

            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    1000+
                  </h3>
                  <p className="text-sm text-slate-500">Faol mentorlar</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-violet-100 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-600 shadow-sm mb-4">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    5000+
                  </h3>
                  <p className="text-sm text-slate-500">
                    Muvaffaqiyatli shogirtlar
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-emerald-100 transition-colors col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1 text-lg">
                        Xavfsiz va Ishonchli
                      </h3>
                      <p className="text-sm text-slate-500">
                        Barcha jarayonlar super adminlar nazoratida
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6 text-slate-500 text-sm">
          <p>© 2026 MentorPro Platformasi. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-8">
            <Link href="tel:+998936399404" className="hover:text-indigo-600 transition-colors">
              Yordam
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
