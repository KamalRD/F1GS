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

export type Event = {
    title: string,
    description: string,
    status: "In Progress" | "Completed",
    startTime: Date,
    endTime: Date,
    image: string;
    location: string;
    rsvp: string;
}