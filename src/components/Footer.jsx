import Link from "next/link";
import Image from "next/image";
import { footerItem } from "@/Data/FooterItem";

const link = footerItem[0].footerlInk;
export default function Footer() {
    return (
        <footer className="bg-secondary-light text-accent-main py-s40 px-s32 space-y-s24 md:space-y-s48 lg:space-y-s64">
            {/* 🔷 Top Section (Logo + Columns) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s24 md:gap-s48 lg:gap-s64">
                {/* 🟦 Logo Section */}
                <div className="w-[200px] md:w-[250px] lg:w-[300px]">
                    <Image
                        src="/logo.svg"
                        alt="Arshiv Legal Logo"
                        width={300}
                        height={136}
                        className="object-contain h-full w-full"
                    />
                </div>

                {/* 🟨 Footer Sections */}
                {footerItem.map((section, index) => (
                    <div key={index} className="flex flex-col gap-s16">
                        <h4 className="font-semibold title-h4 text-accent-main">{section.item}</h4>
                        <ul className="flex flex-col gap-s8 text-disable body-default">
                            {section.subItem.map((sub, i) => (
                                <li key={i}>
                                    <Link
                                        href={sub.link}
                                        className="hover:text-primary-main transition-colors"
                                    >
                                        {sub.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 🟤 Bottom Bar */}
            <div className="max-w-8xl mx-auto flex flex-col items-center gap-s16 text-text-secondary body-small sm:flex-row sm:justify-between sm:items-center sm:gap-0">
                {/* Centered Copyright on Mobile */}
                <p className="text-center w-full sm:w-auto">
                    © 2026 Arshiv Legal. All rights reserved | Design & Developed by <span className="underline"> <Link href={"https://www.oryvia.in"}>Oryvia</Link></span>
                </p>

                {/* Links — bottom in mobile, right in desktop */}
                <div className="flex justify-between w-full sm:w-auto sm:justify-end">
                    <Link
                        href={link.privacy.link}
                        className="hover:text-primary-main transition-colors"
                    >
                        {link.privacy.label}
                    </Link>
                    <Link
                        href={link.terms.link}
                        className="hover:text-primary-main transition-colors"
                    >
                        <span className="sm:mx-s16 mx-s8">{link.terms.label}</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
