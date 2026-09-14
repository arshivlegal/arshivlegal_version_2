"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * FAQSection — Full reusable FAQ layout with interactive accordion & contact CTA card.
 * Optimized for low-end mobile devices using native CSS Grid animations (0fr -> 1fr).
 *
 * @param {string} title           - Section main heading
 * @param {string} subtitle        - Description text below heading
 * @param {Array<object>} items    - Array of { id, question, answer }
 * @param {string} contactTitle    - Title for the small contact card
 * @param {string} contactText     - Subtext for the small contact card
 * @param {string} contactBtnText  - Button label inside the contact card
 * @param {string} contactHref     - Destination for the contact button (mailto: or /contact)
 */
export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about Intellectual Property Law, our legal services, and the educational resources available on this platform.",
  items = defaultFAQItems,
  contactTitle = "Still have a questions?",
  contactText = "Can't find the answer to your question? Send us an email and we'll get back to you as soon as possible!",
  contactBtnText = "Send email",
  contactHref = "mailto:arshivlegal@gmail.com",
}) {
  // Store the active open question ID (null means all closed, allows 1 open at a time)
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="flex w-full flex-col items-center overflow-hidden px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px] bg-[var(--background)]">
      {/* 7XL Container */}
      <div className="flex w-full max-w-7xl flex-col items-start justify-between gap-[60px] lg:flex-row lg:gap-[80px]">
        
        {/* LEFT COLUMN: Heading + Floating "Still have questions?" Card */}
        <div className="flex w-full flex-col justify-between gap-[40px] lg:w-[480px] lg:shrink-0">
          
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-3">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              {title}
            </h2>
            <p className="font-secondary text-[18px] leading-[1.6] text-[var(--text-main)]">
              {subtitle}
            </p>
          </div>

          {/* Contact Support Box */}
          <div className="flex w-full max-w-[455px] flex-col items-start gap-[32px] rounded-[12px] border border-black p-[24px]">
            <div className="flex w-full flex-col items-start gap-3">
              <h3 className="font-primary text-[28px] font-semibold text-[var(--accent-main)]">
                {contactTitle}
              </h3>
              <p className="font-secondary text-[16px] leading-[1.5] text-[var(--text-main)]">
                {contactText}
              </p>
            </div>

            <Link
              href={contactHref}
              className="inline-flex items-center justify-center rounded-[var(--R8)] bg-[var(--accent-main)] px-[20px] py-[10px] font-secondary text-[16px] font-normal text-white transition-opacity hover:opacity-90"
            >
              {contactBtnText}
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Accordion List */}
        <div className="flex w-full flex-1 flex-col items-center gap-[20px] lg:max-w-[675px]">
          {items.map((item, index) => {
            const currentId = item.id ?? index;
            const isOpen = openId === currentId;

            return (
              <div
                key={currentId}
                className="flex w-full flex-col rounded-[16px] border border-[#FFE0BC] bg-[#FFFEF9] p-[20px] md:p-[24px] transition-colors"
              >
                {/* Question Trigger */}
               <button
  type="button"
  onClick={() => toggleAccordion(currentId)}
  className="group flex w-full cursor-pointer items-center justify-between gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-main)] focus-visible:ring-offset-2 rounded-[8px]"
  aria-expanded={isOpen}
>
  {/* Question Text with Hover Color Transition */}
  <span className="font-primary text-[16px] md:text-[20px] font-semibold text-black transition-colors duration-200 group-hover:text-[var(--primary-light)]">
    {item.question}
  </span>

  {/* Toggle Circular Icon */}
  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-main)] text-white transition-transform duration-300">
    <svg
      className={`h-5 w-5 transition-transform duration-300 ${
        isOpen ? "rotate-45" : "rotate-0"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </div>
</button>
                {/* Highly Optimized Native CSS Grid Animation (0fr to 1fr) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Padding/Borders go INSIDE the hidden container so they don't take up space when closed */}
                    <div className="mt-4 border-t border-[#FFE0BC]/60 pt-4">
                      <p className="font-secondary text-[14px] md:text-[16px] leading-[1.6] text-[var(--accent-main)]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Fallback default items extracted directly from your Figma text */
const defaultFAQItems = [
  {
    id: 1,
    question: "What is Intellectual Property?",
    answer: "Intellectual Property (IP) refers to creations of the mind, such as inventions, literary and artistic works, designs, symbols, names, and images used in commerce. It is legally protected by patents, trademarks, and copyright.",
  },
  {
    id: 2,
    question: "What is the difference between a trademark, patent, and copyright?",
    answer: "Trademarks protect brand names, logos, and slogans. Patents protect new inventions and technical processes. Copyright protects original creative expressions such as writing, software code, music, and artworks.",
  },
  {
    id: 3,
    question: "Who can register a trademark?",
    answer: "Any individual, business, startup, NGO, or legal entity claiming to be the proprietor of a trademark used or proposed to be used can apply for registration.",
  },
  {
    id: 4,
    question: "How long does trademark registration take?",
    answer: "In India, a trademark application generally takes between 6 to 12 months to complete registration if there are no objections or oppositions filed.",
  },
  {
    id: 5,
    question: "Can I consult an Intellectual Property lawyer through this website?",
    answer: "Yes, you can reach out through our contact page or schedule an advisory session directly to discuss your specific IP, filing, or dispute requirements.",
  },
  {
    id: 6,
    question: "Are the study materials and legal resources free to access?",
    answer: "Most of our curated legal notes, landmark summaries, and educational guides are freely available for students, researchers, and legal enthusiasts.",
  },
];