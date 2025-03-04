import JekaterinaNovikova from '@/public/images/jekaterina-novikova.jpg';
import MalikehEhghaghi from '@/public/images/malikeh-ehghaghi.jpg';
import MaryMcCarthy from '@/public/images/mary-maccarthy.jpg';
import AnaisHristea from '@/public/images/anais-hristea.jpg';
import AliAkram from '@/public/images/ali-akram.jpg';

export function AboutSection() {
    return (
        <div id="about" className="from-slate-900 via-purple-900/50 to-slate-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">
                    Meet The Team
                </h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <HostCard
                        image={JekaterinaNovikova}
                        name="Jekaterina Novikova"
                        bio="Dr. Jekaterina Novikova is a renowned AI researcher with over 15 years of experience in natural language processing and human-AI interaction. She holds a Ph.D. in Computer Science and has led numerous groundbreaking research projects at prestigious institutions."
                    />
                    <HostCard
                        image={MalikehEhghaghi}
                        name="Malikeh Ehghaghi"
                        bio="Malikeh Ehghaghi is a distinguished AI researcher specializing in machine learning and ethical AI development. With a background in both computer science and philosophy, she brings a unique perspective to discussions about AI's role in society."
                    />
                </div>
                <div className="grid md:grid-cols-3 gap-12 mt-12">
                    <HostCard
                        image={MaryMcCarthy}
                        name="Mary McCarthy"
                        bio="Mary McCarthy | Product Designer"
                    />
                    <HostCard
                        image={AnaisHristea}
                        name="Anais Hristea"
                        bio="Anais Hristea | Product Designer"
                    />
                    <HostCard
                        image={AliAkram}
                        name="Ali Akram"
                        bio="Ali Akram | Backend Developer"
                    />
                    
                </div>
            </div>
        </div>
    );
}

interface HostCardProps {
    image: any;
    name: string;
    bio: string;
}

function HostCard({ image, name, bio }: HostCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-lg shadow-md border border-purple-500/20">
            <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                <img 
                    src={image.src}
                    alt={name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-4">
                {name}
            </h3>
            <p className="text-gray-300 mb-4 text-center">
                {bio}
            </p>
        </div>
    );
} 