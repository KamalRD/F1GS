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