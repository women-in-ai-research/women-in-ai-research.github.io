"use client";

import { useState, useRef, useEffect } from 'react';
import AmandaCercasCurryPhoto from '@/public/images/guests/headshot-amanda.jpeg';
import AparnaBalagopalanPhoto from '@/public/images/guests/headshot-aparna.jpg';
import NouhaDziriPhoto from '@/public/images/guests/headshot-nouha.jpg';
import AngelicaLimPhoto from '@/public/images/guests/headshot-angelica.png';

interface GuestCardProps {
    image?: any;
    name: string;
    title: string;
    bio: string;
}

function GuestCard({ image, name, title, bio }: GuestCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);
    
    useEffect(() => {
        const checkTruncation = () => {
            if (bioRef.current) {
                const { scrollHeight, clientHeight } = bioRef.current;
                setIsTruncated(scrollHeight > clientHeight);
            }
        };
        
        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        
        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, [bio]);

    return (
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow-md border border-purple-500/20">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Fixed square image - left side */}
                <div className="w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0 rounded-lg shrink-0 overflow-hidden">
                    {image ? (
                        <img 
                            src={image.src}
                            alt={name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-purple-400/30 flex items-center justify-center text-white text-2xl">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>
                
                {/* Content container - right side */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white text-center md:text-left mb-1">
                        {name}
                    </h3>
                    <p className="text-purple-300 mb-4 text-center md:text-left">
                        {title}
                    </p>
                    <div className="text-gray-300 text-center md:text-left">
                        <div className={`relative ${expanded ? '' : 'max-h-24 overflow-hidden'}`}>
                            <p ref={bioRef} className={expanded ? '' : 'line-clamp-3'}>
                                {bio}
                            </p>
                            {!expanded && isTruncated && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            )}
                        </div>
                        {isTruncated && (
                            <button 
                                onClick={() => setExpanded(!expanded)} 
                                className="text-cyan-400 hover:text-cyan-300 mt-2 transition-colors font-medium"
                            >
                                {expanded ? 'See less' : 'See more'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 


export function GuestsSection() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 gap-8">
                <GuestCard
                    image={NouhaDziriPhoto}
                    name="Dr. Nouha Dziri"
                    title="Research scientist at Allen Institute for AI (AI2), USA."
                    bio="Dr. Nouha Dziri is an AI research scientist at the Allen Institute for AI (Ai2). Her research investigates a wide variety of problems across NLP and AI including building state-of-the-art language models and understanding their limits and inner workings. She also works on AI safety to ensure the responsible deployment of LLMs while enhancing their reasoning capabilities. Prior to Ai2, she worked at Google DeepMind and Microsoft Research. She earned her PhD from the University of Alberta and the Alberta Machine Intelligence Institute. Her work has been published in top-tier AI venues including NeurIPS, ICML, ICLR, TACL, ACL, NAACL and EMNLP, and featured in TechCrunch, LeMonde, The Economist, Science News and QuantaMagazine."
                />
                <GuestCard
                    image={AmandaCercasCurryPhoto}
                    name="Dr. Amanda Cercas Curry"
                    title="Researcher at MilaNLP in Bocconi University, Italy."
                    bio="Dr. Amanda Cercas Curry is a researcher in CENTAI, where she is working on applied NLP, fairness and evaluation. Her research interests lie at the intersection of Natural Language Processing (NLP), Human-Computer Interaction (HCI) and Feminism with the aim of building more just NLP systems. She is particularly interested in ethics, with a strong influence from feminism. Previously she was a postdoctoral researcher at MilaNLP in Bocconi University. She completed her PhD at Heriot-Watt University in Edinburgh. She also co-hosts a podcast where she discusses all things tech ethics, called Let's Chat Ethics."
                />
                <GuestCard
                    image={AparnaBalagopalanPhoto}
                    name="Aparna Balagopalan"
                    title="PhD student at MIT, USA."
                    bio="Aparna Balagopalan is a PhD student in the Department of Electrical Engineering and Computer Science (EECS) at MIT. Her research broadly focuses on developing fair, interpretable, and robust models by carefully re-evaluating and surfacing assumptions in machine learning-based measurements in socially-relevant contexts. Aparna has held research intern positions at the Stanford RegLab, the Max Planck Institute for Security and Privacy, the Technische Universität, Dresden as a DAAD-WISE scholar, and at the Philips Innovation Campus, Bengaluru in the healthcare R&D team."
                />
                <GuestCard
                    image={AngelicaLimPhoto}
                    name="Dr. Angelica Lim"
                    title="Assistant Professor at Simon Fraser University, Canada."
                    bio="Dr. Angelica Lim is an A.I. roboticist. She is an Assistant Professor in Computing Science at Simon Fraser University and leads the SFU Rosie Lab, where she builds artificial intelligence software for robots to interact with social intelligence and empathy. Her research addresses the question 'Could a robot have feelings?' by combining neuroscience, machine learning and developmental psychology. Angelica has a Ph.D. and M.Sc. in Computer Science from Kyoto University, Japan, specializing in AI applied to Robotics, and a B.Sc. in Computing Science (specializing in Artificial Intelligence) from Simon Fraser University in Canada. Before founding the Rosie Lab, Angelica worked on software teams at SoftBank and Aldebaran Robotics, where she assisted in the development of the infamous Pepper robot. She also previously worked as an intern software engineer and researcher at Google, Honda Research Institute Japan, and I3S-CNRS, France. She also served as a journalist for the IEEE Spectrum Automaton Robotics Blog. Passionate about diversity, she is also Director of the Invent the Future (AI4ALL) program for Canada. She has also developed the SFU Computer Science Teaching Toolkit, with the goal of inspiring people of all backgrounds to pursue Computing Science."
                />
            </div>
        </div>
    );
}

