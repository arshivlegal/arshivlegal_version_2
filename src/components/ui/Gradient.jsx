import React from 'react'

function Gradient({ title, description }) {
    return (
        <div
            className="
    w-full h-[300px]  md:h-[450px]
    bg-[linear-gradient(180deg,var(--background)_0%,var(--primary-main)_50%,var(--background)_100%)]
    flex items-center justify-center
    "
        >
            <section className="max-w-7xl flex flex-col gap-s8 mx-auto text-center px-s16">
                <h1 className="heading-h1 text-secondary-light">
                    {title}
                </h1>
                <p className='body-large text-background '>{description}</p>
            </section>
        </div>
    )
}

export default Gradient
