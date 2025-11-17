import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 bg-[#0f172a] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-start">

          {/* BRAND */}
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-blue-500 text-transparent bg-clip-text">
                BookSwap
              </span>
            </div>
            <p className="text-sm text-gray-300 max-w-[240px] leading-relaxed">
              Your campus book trading platform. Buy, sell, exchange, and donate books with ease.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: "/books", label: "Browse Books" },
                { path: "/sell", label: "Sell Books" },
                { path: "/donate", label: "Donate" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="relative text-gray-400 hover:text-amber-400 transition-colors duration-200
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                      after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-gray-200">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: "/help", label: "Help Center" },
                { path: "/contact", label: "Contact Us" },
                { path: "/faq", label: "FAQ" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="relative text-gray-400 hover:text-amber-400 transition-colors duration-200
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                      after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-gray-200">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: "/terms", label: "Terms of Service" },
                { path: "/privacy", label: "Privacy Policy" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="relative text-gray-400 hover:text-amber-400 transition-colors duration-200
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                      after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 BookSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
