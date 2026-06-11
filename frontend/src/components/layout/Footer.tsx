export function Footer() {
  return (
    <footer className="border-t-2 border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50 text-slate-700">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-brand-600">Basketly</h3>
            <p className="mt-3 text-sm text-slate-600">
              Compare prices across supermarkets and save on your groceries with our intelligent basket optimization.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900">Contact Us</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Email: <a href="mailto:support@basketly.com" className="text-brand-600 hover:text-brand-700">support@basketly.com</a></p>
              <p>Phone: <a href="tel:+61234567890" className="text-brand-600 hover:text-brand-700">+61 (2) 3456 7890</a></p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-slate-900">Address</h4>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>Basketly Inc.</p>
              <p>123 Shopping Street</p>
              <p>Melbourne, VIC 3000</p>
              <p>Australia</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-900">Legal</h4>
            <div className="mt-3 space-y-2 text-sm">
              <a href="#" className="block text-slate-600 hover:text-brand-600">Privacy Policy</a>
              <a href="#" className="block text-slate-600 hover:text-brand-600">Terms of Service</a>
              <a href="#" className="block text-slate-600 hover:text-brand-600">Support</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Basketly. All rights reserved. Compare prices and save on your groceries.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-slate-600 hover:text-brand-600">Contact</a>
              <a href="#" className="text-slate-600 hover:text-brand-600">Blog</a>
              <a href="#" className="text-slate-600 hover:text-brand-600">Careers</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
