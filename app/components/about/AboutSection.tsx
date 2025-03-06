import JekaterinaNovikova from "@/public/images/about/jekaterina-novikova.jpg";
import MalikehEhghaghi from "@/public/images/about/malikeh-ehghaghi.jpg";
import MaryMcCarthy from "@/public/images/about/mary-maccarthy.jpg";
import AnaisHristea from "@/public/images/about/anais-hristea.jpg";
import AliAkram from "@/public/images/about/ali-akram.jpg";

export function AboutSection() {
  return (
    <div
      id="about"
      className="bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center pt-8">
          About Us
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <TeamMemberCard
            image={JekaterinaNovikova}
            name="Jekaterina Novikova"
            bio="Dr. Jekaterina Novikova is a renowned AI researcher with over 15 years of experience in natural language processing and human-AI interaction. She holds a Ph.D. in Computer Science and has led numerous groundbreaking research projects at prestigious institutions."
          />
          <TeamMemberCard
            image={MalikehEhghaghi}
            name="Malikeh Ehghaghi"
            bio="Malikeh is a machine learning researcher at the Vector Institute, and an incoming PhD student at the University of Toronto, where she works under the supervision of Prof. Colin Raffel. Born and raised in Iran, she is a bilingual researcher fluent in Farsi and English who immigrated to Canada in 2019. She earned an MScAC degree in Computer Science from the University of Toronto and has over five years of industry research experience at companies such as Winterlight Labs, Cambridge Cognition, and Arcee AI."
          />
          <TeamMemberCard
            image={MaryMcCarthy}
            name="Mary"
            bio="Head of Growth & Marketing @ Arcee.ai | AI, Data, & Growth Advisor | Host of the Tech Bros Show"
          />
          <TeamMemberCard
            image={AnaisHristea}
            name="Anais"
            bio="Graphic Designer / Illustrator"
          />
          <TeamMemberCard
            image={AliAkram}
            name="Ali Akram"
            bio="AI Engineer / Technical Producer"
          />
        </div>
      </div>
    </div>
  );
}

interface TeamMemberCardProps {
  image?: any;
  name: string;
  bio: string;
}

function TeamMemberCard({ image, name, bio }: TeamMemberCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-lg shadow-md border border-purple-500/20">
      <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
        {image ? (
          <img
            src={image.src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-400/30 flex items-center justify-center text-white">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white text-center mb-4">{name}</h3>
      <p className="text-gray-300 mb-4 text-center">{bio}</p>
    </div>
  );
}
