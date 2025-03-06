import { getPageUrl } from "@/app/components/common/urls";

export function BlogSection() {
  return (
    <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-purple-500/20">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
        Latest from the Blog
      </h3>
      <div className="space-y-4">
        <BlogPost
          href="/blog/post-1"
          title="The Evolution of AI Ethics"
          excerpt="Exploring the latest developments in AI ethics and their implications..."
          titleGradient="from-cyan-300 to-blue-300"
          textColor="text-teal-300"
        />

        <BlogPost
          href="/blog/post-2"
          title="Women Leading AI Research"
          excerpt="Highlighting groundbreaking research by women in the AI field..."
          titleGradient="from-purple-300 to-pink-300"
          textColor="text-indigo-300"
        />
      </div>
      <a
        href={getPageUrl("/blog")}
        className="inline-block mt-6 text-purple-400 hover:text-purple-300"
      >
        Read More →
      </a>
    </div>
  );
}

interface BlogPostProps {
  href: string;
  title: string;
  excerpt: string;
  titleGradient: string;
  textColor: string;
}

function BlogPost({
  href,
  title,
  excerpt,
  titleGradient,
  textColor,
}: BlogPostProps) {
  return (
    <a
      href={getPageUrl(href)}
      className="block hover:bg-white/5 p-4 rounded-lg transition-colors duration-300"
    >
      <h4
        className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} font-semibold mb-2`}
      >
        {title}
      </h4>
      <p className={`${textColor} text-sm`}>{excerpt}</p>
    </a>
  );
}
