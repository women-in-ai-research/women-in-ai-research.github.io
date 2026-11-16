import logoData from '@/data/event-logos.json';

interface LogoEntry {
    match: string;
    image: string;
    alt: string;
}

export function logoFor(title: string): LogoEntry | undefined {
    const t = title.toLowerCase();
    return (logoData.logos as LogoEntry[]).find((l) => t.includes(l.match.toLowerCase()));
}

/** The event's logo on a white tile, so dark and coloured logos stay legible on the purple background. */
export function EventLogo({ title, className = 'h-16 w-28' }: { title: string; className?: string }) {
    const logo = logoFor(title);
    if (!logo) return null;
    return (
        <span className={`inline-flex items-center justify-center shrink-0 bg-white rounded-xl p-2 ${className}`}>
            <img src={logo.image} alt={`${logo.alt} logo`} className="max-h-full max-w-full object-contain" />
        </span>
    );
}
