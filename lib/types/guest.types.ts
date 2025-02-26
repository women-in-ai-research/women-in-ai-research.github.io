export interface GuestSocialLinks {
twitter?: string;
linkedin?: string;
website?: string;
}

export interface Guest {
id: number;
name: string;
title: string;
organization: string;
bio: string;
image: string;
episodes: number[];
socialLinks: GuestSocialLinks;
}

export interface GuestsData {
guests: Guest[];
}