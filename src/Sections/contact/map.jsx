export default function ContactMap({ embedUrl }) {
    return (
        <div className="relative w-full h-[350px] rounded-r8 overflow-hidden ">
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
            ></iframe>
        </div>

    );
}
