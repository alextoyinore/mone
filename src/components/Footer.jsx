import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold mb-4 text-text-secondary-light dark:text-text-secondary-dark">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/about" className="hover:text-brand-primary">About</a></li>
            <li><a href="/contact" className="hover:text-brand-primary">Contact</a></li>
            <li><a href="/privacy" className="hover:text-brand-primary">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-text-secondary-light dark:text-text-secondary-dark">
            Connect
          </h4>
          <ul className="space-y-2 text-xs">
            <li>© 2024 Mone Music</li>
            <li>All rights reserved</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
