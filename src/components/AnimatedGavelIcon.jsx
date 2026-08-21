import Image from "next/image";

const AnimatedGavelIcon = ({ isOpen, onClick, variant = "blue" }) => {
  // Pick icon based on variant
  const iconSrc =
    variant === "blue"
      ? "/Images/gavel-blue.svg"
      : "/Images/gavel-brown.svg"; // fallback for other variant

  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      className="relative w-8 h-8 flex items-center justify-center hover:cursor-pointer"
    >
      {/* Top Gavel */}
      <Image
        src={iconSrc}
        alt="Gavel Icon"
        width={32}
        height={32}
        className={`
          absolute w-6 h-6 transform transition-transform duration-500 ease-in-out
          ${isOpen ? "rotate-[135deg] translate-y-0" : "-translate-y-[6px] rotate-0"}
        `}
      />

      {/* Bottom Gavel (mirrored) */}
      <Image
        src={iconSrc}
        alt="Gavel Icon"
        width={32}
        height={32}
        className={`
          absolute w-6 h-6 transform transition-transform duration-500 ease-in-out scale-x-[-1]
          ${isOpen ? "-rotate-[135deg] translate-y-0" : "translate-y-[6px] rotate-0"}
        `}
      />
    </button>
  );
};

export default AnimatedGavelIcon;
