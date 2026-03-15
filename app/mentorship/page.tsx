"use client";

import { Navbar } from "@/app/components/navigation/Navbar";
import { Footer } from "@/app/components/footer/Footer";

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wiair-darkest via-wiair-dark to-wiair-darkest">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative blur orbs */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-wiair-medium/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="inline-flex items-center gap-2 bg-wiair-medium/20 border border-wiair-medium/30 rounded-full px-4 py-1.5 mx-auto block text-center mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-wiair-light text-sm font-medium tracking-wide">
              Now Accepting Applications
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-center leading-tight">
            <span className="text-white">Mentorship</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Research Lab
            </span>
          </h1>

          <p className="text-xl text-gray-300 text-center mt-8 max-w-3xl mx-auto leading-relaxed">
            A structured research mentorship lab that actively trains new
            researchers, promotes equality and safety in AI, and uplifts women
            leaders in the field.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="#apply"
              className="group relative bg-gradient-to-r from-wiair-medium to-purple-500 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-wiair-medium/25 hover:shadow-xl hover:shadow-wiair-medium/40 text-center font-semibold hover:-translate-y-0.5"
            >
              Apply for Mentorship
            </a>
            <a
              href="#about"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-center font-semibold"
            >
              Learn More
            </a>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1:1</div>
              <div className="text-sm text-gray-400 mt-1">Mentorship</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl font-bold text-white">Top-Tier</div>
              <div className="text-sm text-gray-400 mt-1">Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Free</div>
              <div className="text-sm text-gray-400 mt-1">Always</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Lab Philosophy */}
      <section id="about" className="py-24 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              Our Foundation
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Lab Philosophy
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              While affiliated with Women in AI Research, the lab is inclusive
              &mdash; focused on building informed allies across the field.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PhilosophyCard
              icon="🌟"
              color="from-purple-500/20 to-pink-500/20"
              borderColor="border-purple-500/30"
              title="Uplifting Women Researchers"
              description="Elevating underrepresented voices to leadership roles through hands-on mentorship and research opportunities."
            />
            <PhilosophyCard
              icon="⚖️"
              color="from-blue-500/20 to-purple-500/20"
              borderColor="border-blue-500/30"
              title="Equality, Fairness & Safety"
              description="Promoting research perspectives that prioritize ethical development and responsible deployment of AI systems."
            />
            <PhilosophyCard
              icon="🤝"
              color="from-pink-500/20 to-orange-500/20"
              borderColor="border-pink-500/30"
              title="Creating Informed Allies"
              description="Building a collaborative community that champions equality and rigorous research standards across all backgrounds."
            />
          </div>
        </div>
      </section>

      {/* What Mentees Get */}
      <section className="py-24 relative">
        <div className="absolute left-0 top-1/3 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              The Experience
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              What Mentees Get
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Structure, expertise, and connections to bridge the gap between
              inspiration and impactful contribution.
            </p>
          </div>

          <div className="space-y-4">
            <BenefitRow
              number="01"
              title="Guided Innovation"
              description="Direct guidance on high-impact ML and NLP research problems from experienced researchers in the field."
            />
            <BenefitRow
              number="02"
              title="Publication Opportunities"
              description="Collaborate on projects with real potential to lead to top-tier peer-reviewed publications at ACL, NAACL, and NeurIPS."
            />
            <BenefitRow
              number="03"
              title="Professional Workflows"
              description="Gain hands-on exposure to rigorous professional research environments and industry-standard workflows."
            />
            <BenefitRow
              number="04"
              title="Industry Networking"
              description="Interact and collaborate with distinguished industry researchers and leaders in AI fairness and applied systems."
            />
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Timeline */}
      <section className="py-24 relative">
        <div className="absolute right-1/4 top-0 w-[400px] h-[400px] bg-wiair-medium/10 rounded-full blur-[140px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              Roadmap
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Action Plan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our structured timeline for launching the lab and onboarding our
              first cohort of researchers.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-wiair-medium/60 via-wiair-medium/30 to-transparent" />

            <div className="space-y-12">
              <TimelineItem
                date="January 2026"
                title="Platform Launch"
                description="Website launch to host the mission, processes, mentee spotlights, and research outcomes."
                side="left"
                completed
              />
              <TimelineItem
                date="February 2026"
                title="Associate Mentors"
                description="Expanding the mentor pool with distinguished circle members to formalize roles and determine cohort size."
                side="right"
                completed
              />
              <TimelineItem
                date="Late Feb - March"
                title="Call for Mentees"
                description="Launch applications for the very first cohort. Slots will be decided based on mentor participation."
                side="left"
                active
              />
              <TimelineItem
                date="Spring 2026"
                title="First Cohort Begins"
                description="Prioritizing research projects aimed at top-tier venues like ACL, NAACL, COLING, and NeurIPS."
                side="right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="py-24 relative">
        <div className="absolute right-0 top-1/3 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              Your Guides
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Mentors</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experienced researchers providing hands-on guidance to mentees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wiair-medium/10 rounded-full blur-[60px]" />
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src="/images/mentorship/smriti-singh.jpg"
                    alt="Smriti Singh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="inline-block text-xs font-semibold bg-gradient-to-r from-wiair-medium to-purple-500 text-white px-3 py-1 rounded-full mb-3">
                  Lead Mentor
                </span>
                <a
                  href="https://www.linkedin.com/in/smriti-singh-ss2000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link"
                >
                  <h3 className="text-xl font-bold text-white group-hover/link:text-wiair-light transition-colors duration-300">
                    Smriti Singh
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    ML Research @ Zacks Investment Research | MS CS @ UT Austin | AI Safety | GenAI for FinTech
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-wiair-light/60 group-hover/link:text-wiair-light text-sm transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </div>
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Associate mentors will be announced soon.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Advisors */}
      <section className="py-24 relative">
        <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              Guidance
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Advisors</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Distinguished researchers guiding the lab&apos;s direction and
              research standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <AdvisorCard
              name="Aman Chadha"
              title="GenAI Leadership @ Apple | Stanford AI | EMNLP 2023 Outstanding Paper Award"
              image="/images/mentorship/aman-chadha.jpg"
              linkedin="https://www.linkedin.com/in/amanc/"
            />
            <AdvisorCard
              name="Vinija Jain"
              title="ML Leadership @ Google | Stanford AI | EMNLP Outstanding Paper Award"
              image="/images/mentorship/vinija-jain.jpg"
              linkedin="https://www.linkedin.com/in/vinija/"
            />
            <AdvisorCard
              name="Sreyoshi Bhaduri, Ph.D."
              title="Agentic AI @ Amazon | Speaker | Educator"
              image="/images/mentorship/sreyoshi-bhaduri.jpg"
              linkedin="https://www.linkedin.com/in/thatstatsgirl/"
            />
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Call for Mentors */}
      <section className="py-24 relative">
        <div className="absolute left-1/4 top-0 w-[400px] h-[400px] bg-wiair-medium/10 rounded-full blur-[140px]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-wiair-medium/20 to-purple-600/20 backdrop-blur-xl p-12 rounded-3xl border border-wiair-medium/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-wiair-medium/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
                Get Involved
              </p>
              <h2 className="text-4xl font-bold text-white mb-4">
                Call for Mentors
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
                Are you an experienced researcher passionate about mentoring the
                next generation? We&apos;re looking for associate mentors to
                join our lab and guide aspiring researchers.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSclhjbPKywT40frbggnmonfGbem81hXuCsYyEFFgmUiXxsImg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-wiair-medium to-purple-500 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-wiair-medium/25 hover:shadow-xl hover:shadow-wiair-medium/40 font-semibold hover:-translate-y-0.5"
              >
                Apply to Mentor
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-wiair-medium/40 to-transparent" />

      {/* Selection & Functioning */}
      <section id="apply" className="py-24 relative">
        <div className="absolute left-1/3 bottom-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-wiair-light text-sm font-semibold tracking-widest uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Selection & Process
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A fair, transparent, and merit-based recruitment process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Application Process */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wiair-medium/10 rounded-full blur-[60px]" />
              <h3 className="text-xl font-bold text-white mb-2 relative">
                Application Process
              </h3>
              <p className="text-gray-400 text-sm mb-8 relative">
                Three stages to ensure equitable selection:
              </p>
              <div className="space-y-6 relative">
                <ApplicationStep
                  step={1}
                  title="Initial Application"
                  description="Submit your background, interests, and motivation via Google Form."
                />
                <ApplicationStep
                  step={2}
                  title="Technical Task"
                  description="Complete a small technical assessment relevant to your research area."
                />
                <ApplicationStep
                  step={3}
                  title="Interview"
                  description="Meet with mentors to discuss goals, fit, and research interests."
                />
              </div>
            </div>

            {/* Lab Functioning */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[60px]" />

              <h3 className="text-xl font-bold text-white mb-6 relative">
                How the Lab Works
              </h3>

              <div className="space-y-6 relative">
                <div>
                  <p className="text-wiair-light font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-wiair-medium rounded-full" />
                    Research Pace Depends On
                  </p>
                  <ul className="space-y-2 ml-3">
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Mentee skill level and experience
                    </li>
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Availability and individual schedules
                    </li>
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Project complexity and scope
                    </li>
                  </ul>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <p className="text-wiair-light font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-pink-500 rounded-full" />
                    The Lab Will Maintain
                  </p>
                  <ul className="space-y-2 ml-3">
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Written, actionable feedback artifacts
                    </li>
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Regular progress tracking milestones
                    </li>
                    <li className="text-gray-300 text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0" />
                      Public documentation of outcomes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PhilosophyCard({
  icon,
  color,
  borderColor,
  title,
  description,
}: {
  icon: string;
  color: string;
  borderColor: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`group relative bg-gradient-to-br ${color} p-8 rounded-2xl border ${borderColor} hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="text-5xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-start gap-6 p-6 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <span className="text-3xl font-bold text-wiair-medium/40 group-hover:text-wiair-medium transition-colors duration-300 shrink-0 font-mono">
        {number}
      </span>
      <div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-wiair-light transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  date,
  title,
  description,
  side,
  active = false,
  completed = false,
}: {
  date: string;
  title: string;
  description: string;
  side: "left" | "right";
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-6 md:gap-0">
      {/* Dot */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            active
              ? "bg-wiair-medium border-wiair-light shadow-lg shadow-wiair-medium/50 ring-4 ring-wiair-medium/20"
              : completed
                ? "bg-wiair-medium border-wiair-medium"
                : "bg-wiair-darkest border-gray-600"
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
          side === "right" ? "md:ml-auto md:pl-8" : "md:mr-auto md:pr-8 md:text-right"
        }`}
      >
        <div
          className={`bg-white/5 backdrop-blur-sm p-5 rounded-xl border transition-all duration-300 hover:bg-white/10 ${
            active
              ? "border-wiair-medium/40 shadow-lg shadow-wiair-medium/10"
              : "border-white/10"
          }`}
        >
          <p
            className={`text-sm font-semibold mb-1 ${
              active ? "text-wiair-light" : completed ? "text-wiair-medium" : "text-gray-500"
            }`}
          >
            {date}
            {active && (
              <span className="ml-2 text-xs bg-wiair-medium/20 text-wiair-light px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
            {completed && (
              <span className="ml-2 text-xs text-green-400">✓</span>
            )}
          </p>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function AdvisorCard({
  name,
  title,
  image,
  linkedin,
}: {
  name: string;
  title: string;
  image?: string;
  linkedin: string;
}) {
  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-wiair-medium/30 hover:bg-white/[0.12] transition-all duration-300 text-center block"
    >
      {image ? (
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-4">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-wiair-medium/30 to-purple-500/30 flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:from-wiair-medium/50 group-hover:to-purple-500/50 transition-all duration-300">
          {name.charAt(0)}
        </div>
      )}
      <h3 className="text-lg font-bold text-white group-hover:text-wiair-light transition-colors duration-300">
        {name}
      </h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
      <div className="mt-4 flex items-center justify-center gap-1 text-wiair-light/60 group-hover:text-wiair-light text-sm transition-colors duration-300">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </div>
    </a>
  );
}

function ApplicationStep({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wiair-medium to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-wiair-medium/20">
          {step}
        </div>
        {step < 3 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-wiair-medium/40 to-transparent" />
        )}
      </div>
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-400 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}
