"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-purple-100 text-black pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Navigasi Fitur */}
        <div>
          <h3 className="font-bold text-lg mb-4">CalmMe</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/consultation" className="hover:underline">
                Consultation
              </Link>
            </li>
            <li>
              <Link href="/payment-history" className="hover:underline">
                Payment History
              </Link>
            </li>
            <li>
              <Link href="/meditate" className="hover:underline">
                Meditate
              </Link>
            </li>
            <li>
              <Link href="/assessment" className="hover:underline">
                Assessment
              </Link>
            </li>
            <li>
              <Link href="/dailymood" className="hover:underline">
                Daily Mood
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Lainnya */}
        <div>
          <h3 className="font-bold text-lg mb-4">Lainnya</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>
            </li>
            <li>
              <a
                href="mailto:help.calmme787@gmail.com"
                className="hover:underline"
              >
                help.calmme787@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Media Sosial */}
        <div>
          <h3 className="font-bold text-lg mb-4">Media Sosial</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <svg
                className="w-7 h-7 fill-white hover:fill-h-ungu transition"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35C.592 0 0 .593 0 1.326v21.348C0 23.407.592 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24h-1.918c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.407 24 22.674V1.326C24 .593 23.406 0 22.675 0" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg
                className="w-7 h-7 fill-white hover:fill-h-ungu transition"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.069 1.646.069 4.847s-.011 3.581-.069 4.847c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.581 2.163 15.201 2.163 12s.012-3.581.069-4.847c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.771.131 4.659.403 3.678 1.385c-.981.981-1.254 2.093-1.313 3.374C2.014 8.332 2 8.741 2 12c0 3.259.014 3.668.072 4.948.059 1.281.332 2.393 1.313 3.374.981.981 2.093 1.254 3.374 1.313C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.281-.059 2.393-.332 3.374-1.313.981-.981 1.254-2.093 1.313-3.374.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.059-1.281-.332-2.393-1.313-3.374-.981-.981-2.093-1.254-3.374-1.313C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
              </svg>
            </a>
          </div>
          <div>
            <span className="block text-sm">Bagian dari CalmMe</span>
            <a
              href="mailto:help.calmme787@gmail.com"
              className="block text-sm hover:underline"
            >
              help.calmme787@gmail.com
            </a>
          </div>
        </div>
      </div>
      <hr className="border-t border-white/30 my-6" />
      <div className="text-center text-sm text-white/80">
        Hak Cipta © {new Date().getFullYear()} CalmMe
      </div>
    </footer>
  );
}
