import { getPageUrl } from "@/app/components/common/urls";

export function ReviewsSection() {
  return (
    <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-purple-500/20">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        Listener Reviews
      </h3>
      <div className="space-y-6">
        <Review
          text="One of the most insightful podcasts about AI and its impact on society. The diverse perspectives are invaluable."
          author="Sarah M., AI Researcher"
          authorColor="text-teal-300"
        />

        <Review
          text="Essential listening for anyone interested in the future of AI and technology."
          author="Dr. Emily Chen"
          authorColor="text-indigo-300"
        />
      </div>
      <a
        href={getPageUrl("/reviews")}
        className="inline-block mt-6 text-purple-400 hover:text-purple-300"
      >
        View All Reviews →
      </a>
    </div>
  );
}

interface ReviewProps {
  text: string;
  author: string;
  authorColor: string;
}

function Review({ text, author, authorColor }: ReviewProps) {
  return (
    <div className="relative">
      <div className="absolute -top-2 -left-2 text-4xl text-purple-400">"</div>
      <p className="text-gray-200 pl-6">{text}</p>
      <p className={`${authorColor} text-sm mt-2 pl-6`}>- {author}</p>
    </div>
  );
}
