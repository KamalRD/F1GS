'use client';
import React from "react";

import { motion } from "framer-motion"

type ButtonProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    color?: 'primary' | 'secondary';
    hoverColor?: 'primary' | 'secondary';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    disabled?: boolean;
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button" | undefined;
}

const ButtonStyles = {
    "size": {
        "xsmall": "h-8 rounded-full px-8 py-6 text-lg font-bold",
        "small": "h-12 rounded-full px-10 py-8 text-lg font-bold",
        "medium": "h-16 rounded-full px-10 py-8 text-xl font-bold",
        "large": "h-20 rounded-full px-10 py-8 text-2xl font-bold"
    },
    "color": {
        "primary": "bg-brand_red text-brand_white",
        "secondary": "bg-brand_gold text-brand_black"
    },
    "hoverBackground": {
        "primary": "#900028",
        "secondary": "#D5AC31"
    },
    "hoverText": {
        "primary": "#F4F4F4",
        "secondary": "#1E1E1E"
    }
}

export default function Button({ onClick, color, size, disabled, children, hoverColor, type }: ButtonProps) {
    return (
        <motion.button 
            type={type}
            className={`${ButtonStyles.size[size ?? 'medium']} ${ButtonStyles.color[color ?? 'primary']} flex items-center`}
            disabled={disabled}
            onClick={onClick}
            whileHover={{ scale: 1.25, background: ButtonStyles.hoverBackground[hoverColor ?? 'secondary'], color: ButtonStyles.hoverText[hoverColor ?? 'secondary']}}
        >
            {children}
        </motion.button>
    )
}