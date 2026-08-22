"use client";

import React from "react";
import Data from "@/Data/data.json";

export default function PrivacyPolicy() {
    const { privacyPolicy } = Data;

    if (!privacyPolicy) return <p className="p-s32 text-red-main">Data not found.</p>;

    const { title, lastUpdated, introBlock, notice, sections, Note } = privacyPolicy;

    return (
        <main className="w-full py-24 lg:py-32">
            <section className="max-w-5xl mx-auto px-s16 md:px-s32 space-y-24 lg:space-y-s64">

                {/* TITLE */}
                <h1 className="page-title-h2 text-primary-main">{title}</h1>
                <p className="caption text-secondary">Last Updated: {lastUpdated}</p>

                {/* INTRO */}
                <div className="space-y-s16 body-large">
                    <p>
                        {introBlock[0]}
                        <span className="text-accent-main">{Note.link}</span>
                        {Note.name}
                    </p>
                    <p>{introBlock[1]}</p>
                </div>

                {/* NOTICE BOX */}
                <div className="bg-secondary-light border-l-4 border-accent-main p-s16 rounded-r8">
                    <p className="body-default text-accent-main">{notice}</p>
                </div>

                {/* SECTIONS */}
                {sections.map((sec) => (
                    <div key={sec.number} className="space-y-s24">

                        {/* SECTION HEADING */}
                        <h2 className="subheading-h3 flex items-center">
                            <span>{sec.number}.&nbsp;</span>
                            {sec.heading}
                        </h2>

                        {/* PARAGRAPHS */}
                        {sec.paragraphs && (
                            <div className="space-y-s8 body-large">
                                {sec.paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        )}

                        {/* BULLETS */}
                        {sec.bullets && (
                            <ul className="list-disc pl-s24 space-y-s8 body-large">
                                {sec.bullets.map((b, i) =>
                                    Array.isArray(b) ? (
                                        b.map((child, j) => <li key={`${i}-${j}`}>{child}</li>)
                                    ) : (
                                        <li key={i}>{b}</li>
                                    )
                                )}
                            </ul>
                        )}

                        {/* SUBSECTIONS */}
                        {sec.subsections &&
                            sec.subsections.map((sub, i) => (
                                <div key={i} className="space-y-s8">

                                    <h3 className="title-h4">{sub.title}</h3>

                                    {sub.paragraphs && (
                                        <div className="space-y-s8 body-large">
                                            {sub.paragraphs.map((sp, j) => (
                                                <p key={j}>{sp}</p>
                                            ))}
                                        </div>
                                    )}

                                    {sub.bullets && (
                                        <ul className="list-disc pl-s24 space-y-s8 body-large">
                                            {sub.bullets.map((sb, j) => (
                                                <li key={j}>{sb}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {sub.conclusion && (
                                        <p className="body-default text-secondary">
                                            <span className="body-default text-secondary">{sub.Note}</span>
                                            {sub.conclusion}
                                        </p>
                                    )}

                                    {sub.lower && (
                                        <p className="body-large text-main">{sub.lower}</p>
                                    )}

                                </div>
                            ))}

                        {/* CONCLUSION */}
                        {sec.conclusion && (
                            <div className="space-y-s12">
                                {sec.conclusion.map((c, i) => (
                                    <p key={i} className="body-default text-secondary">
                                        {c}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* COLORED TEXT */}
                        {sec.colored && (
                            <div className="space-y-s12">
                                {sec.colored.map((c, i) => (
                                    <p key={i} className="body-large text-accent-main">
                                        {c}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* LOWER (FINAL PARAGRAPH) */}
                        {sec.lower && (
                            <div className="space-y-s12">
                                {sec.lower.map((c, i) => (
                                    <p key={i} className="body-large">
                                        {c}
                                    </p>
                                ))}
                            </div>
                        )}

                    </div>
                ))}
            </section>
        </main>
    );
}
