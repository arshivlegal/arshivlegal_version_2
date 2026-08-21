"use client";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

/**
 * DisclaimerGate
 * Props:
 *  - storage: "local" | "session"      (local = localStorage, session = sessionStorage)
 *  - expirySeconds: number | null     (null = never expire). Default 2 seconds.
 */
export default function DisclaimerGate({
    storage = "local",
    expirySeconds = 3600, // expires after 2 seconds by default
}) {
    const [visible, setVisible] = useState(false);
    const key = "disclaimerAccepted";

    const getStore = () => (storage === "session" ? sessionStorage : localStorage);

    useEffect(() => {
        try {
            const store = getStore();
            const raw = store.getItem(key);
            // debug
            // console.log("DisclaimerGate init — raw value:", raw);

            if (!raw) {
                setVisible(true);
                return;
            }

            // try parse stored JSON { acceptedAt: ISOstring }
            try {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.acceptedAt) {
                    if (expirySeconds == null) {
                        setVisible(false);
                        return;
                    }
                    const acceptedAt = new Date(parsed.acceptedAt).getTime();
                    const expireMs = expirySeconds * 1000;
                    if (Date.now() - acceptedAt > expireMs) {
                        // expired -> remove and show again
                        store.removeItem(key);
                        setVisible(true);
                    } else {
                        setVisible(false);
                    }
                    return;
                }
            } catch (e) {
                // fallback for legacy "true" value
                if (raw === "true") {
                    setVisible(false);
                    return;
                }
            }

            // default fallback: hide
            setVisible(false);
        } catch (err) {
            // storage access failed -> show gate to be safe
            console.warn("DisclaimerGate storage read failed:", err);
            setVisible(true);
        }
    }, [expirySeconds, storage]);

    // lock scroll while visible
    useEffect(() => {
        if (visible) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }
    }, [visible]);

    const accept = () => {
        try {
            const store = getStore();
            const value = JSON.stringify({ acceptedAt: new Date().toISOString() });
            store.setItem(key, value);
            // console.log("DisclaimerGate accepted, saved:", value);
        } catch (err) {
            console.warn("Could not save disclaimer acceptance:", err);
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-99999 flex items-end justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby="disclaimer-title"
        >
            {/* Backdrop + blur */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />

            {/* Slide-up drawer (full width up to 7xl) */}
            <div
                className="relative animate-slideUp  bg-secondary-light max-w-4xl rounded-r8 flex-col  space-y-s16   text-left  p-s32"
                style={{ touchAction: "none" }}
            >


                <h2 id="disclaimer-title" className="page-title-h2 ">
                    Disclaimer
                </h2>

                <p className="body-default text-left text-accent-main ">
                    By continuing to browse this website you acknowledge that the content is for informationalpurposes only and does not constitute legal advice.By continuing to browse this website you acknowledge that the content is for informational purposes only and does not constitute legal advice.By continuing to browse this website you acknowledge that the content is for informational
                    purposes only and does not constitute legal advice.
                </p>

                <Button onClick={accept} children={"Accept"} className="" />
            </div>
        </div>
    );
}
