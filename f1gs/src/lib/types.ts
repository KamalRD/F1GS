export type CarouselCard = {
    title: string,
    icon: string,
    alt: string,
    content: string
}

export type IconProps = {
    size: "sm" | "md" | "lg";
    url: string;
    alt: string;
    className?: string;
    onClick?: () => void
}

export type BoardMember = {
    first_name: string,
    last_name: string,
    name: string,
    position: string,
    image: string,
    id: string,
    linkedin: string,
}

export type F1GSMember = {
    name: string;
    email: string;
    tags: Array<string>;
}

export type MailchimpMember = {
    full_name: string;
    email_address: string;
    tags: Array<{ id: number, name: string }>;
}

export interface FrontEndEvent {
    title: string,
    description: string,
    status: StatusType
    start_time: Date,
    end_time: Date,
    image: string;
    location: string;
    rsvp: string;
}

export interface BackEndEvent {
    title: string,
    description: string,
    status: StatusType
    start_time: Date,
    end_time: Date,
    image: File | string;
    location: string;
    rsvp: string;
    id: string;
}

export type StatusType = "In Progress" | "Upcoming" | "Completed";
export type DayLawYear = '1L' | '2L' | '3L';
export type NightLawYear = '1LE' | '2LE' | '3LE' | '4LE';