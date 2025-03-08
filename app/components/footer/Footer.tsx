import { getPageUrl } from "@/app/components/common/urls";
import { SocialLinks } from "@/app/components/common/SocialLinks";

export function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-black/50 text-white py-16 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <FooterBrand />
          <FooterSocial />
          <FooterSubscribe />
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Women in AI Research Podcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Women in AI Research
      </h3>
      <p className="text-purple-300">
        Highlighting the women shaping the future of AI research
      </p>
    </div>
  );
}

function FooterSocial() {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-xl font-bold mb-4">
        Follow Us
      </h3>
      <SocialLinks className="justify-center md:justify-start" />
    </div>
  );
}

function FooterSubscribe() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-400 mb-4">
        Stay updated with our latest episodes and events
      </p>
      <div className="flex">
        <input
          type="email"
          placeholder="Your email"
          className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
          Subscribe
        </button>
      </div>
    </div>
  );
}
