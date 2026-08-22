"use client";
import React from "react";
import Link from "next/link";
import Data from "@/Data/data.json";

export default function TermsOfUse() {
    const { termsOfUse } = Data;

    if (!termsOfUse)
        return <p className="p-s32 text-red-main">Data not found.</p>;

    const { title, effectiveDate, website, entity, sections } =
        termsOfUse;

    return (
        <main className="w-full bg-background text-main py-s40 lg:py-32">
            <section className="max-w-5xl mx-auto px-s16 md:px-s32 space-y-24 lg:space-y-s64">

                {/* TITLE */}
                <h1 className="hero-h1 text-primary-main">{title}</h1>

                {/* BASIC INFO */}
                <div className="body-large text-secondary">
                    <p>
                        <span className="font-semibold text-main">Effective Date:</span>{" "}
                        {effectiveDate}
                    </p>
                    <p>
                        <span className="font-semibold text-main">Website:</span>{" "}
                        <span className="text-accent-main ">
                            {website}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold text-main">Entity:</span> {entity}
                    </p>
                </div>

                {/* SECTIONS */}
                {sections.map((section, index) => (
                    <div key={index} className="space-y-s24">

                        {/* SECTION TITLE */}
                        <h2 className="subheading-h3">{section.title}</h2>

                        {/* PART1 + LINK + PART2 */}
                        {(section.part1 || section.link) && (
                            <p className="body-large">
                                {section.part1 && <>{section.part1}</>}
                                {section.link && (
                                    <Link
                                        href={section.link || "#"}
                                        className="text-accent-main underline"
                                    >
                                        {section.placeholder}
                                    </Link>
                                )}
                                {section.part2 && <>{section.part2}</>}
                            </p>
                        )}

                        {/* CONTENT BLOCK */}
                        {section.content && (
                            <div className="space-y-s12 body-large">
                                {section.content.map((item, i) =>
                                    Array.isArray(item) ? (
                                        <ul key={i} className="list-disc pl-s24 space-y-s8">
                                            {item.map((bullet, j) => (
                                                <li key={`${i}-${j}`}>{bullet}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p key={i}>{item}</p>
                                    )
                                )}
                            </div>
                        )}

                        {/* COLORED SINGLE ACCENT LINE */}
                        {section.colored && (
                            <span className="body-large text-accent-main">{section.colored}</span>
                        )}

                        {/* LINK1 + part1 + link2 + part2 */}
                        {section.placeholder1 && (
                            <p className="body-large">
                                {section.part10}
                                <Link
                                    href={section.link1|| "#"}
                                    className="text-accent-main underline"
                                >
                                    {section.placeholder1}
                                </Link>{" "}
                                {section.part11}{" "}
                                <Link
                                    href={section.link2 || "#"}
                                    className="text-accent-main underline"
                                >
                                    {section.placeholder2}
                                </Link>{" "}
                                {section.part12}
                            </p>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
}
