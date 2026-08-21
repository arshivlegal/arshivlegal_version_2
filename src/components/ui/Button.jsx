import React from "react";
import Link from "next/link";

function Button({ variant = "primary", children, href, as = "button", className = "", ...props }) {
    const baseClass = "inline-flex items-center justify-center px-s24 py-s8 h-fit rounded-r8 hover:cursor-pointer";

    const variants = {
        primary: "body-default bg-primary-main text-background hover:bg-primary-light",
        secondary: "body-default text-accent-main bg-secondary-light hover:bg-secondary-light hover:text-accent-main",
        ctaAccent: "body-large text-background bg-accent-main hover:bg-secondary-light hover:text-accent-main",
        ctaSecondary: "body-large text-accent-main bg-secondary-light hover:bg-secondary-light hover:text-accent-main",
        outliner:
            "body-default text-primary-main hover:bg-primary-main hover:text-background border-primary-main border-2",
        destructive: "body-default text-background bg-Blue-link hover:bg-Blue-hover",
    };

    // ✅ Merge variant + base + extra custom classes
    const allClasses = `${baseClass} ${variants[variant] || variants.primary} ${className}`;

    if (as === "link" && href) {
        return (
            <Link href={href} className={allClasses} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={allClasses} {...props}>
            {children}
        </button>
    );
}

export default Button;
