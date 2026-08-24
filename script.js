document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

    const items = document.querySelectorAll('.list-item.benefits');

    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    const glow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.reviews-track').forEach((track) => {
    const cards = [...track.querySelectorAll('.review-card')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!cards.length || reduceMotion) return;

    let paused = false;
    let lastFrame = null;
    let position = 0;
    const speed = 28; // pixels por segundo
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

    const pause = () => { paused = true; };
    const play = () => { paused = false; };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', play);

    const move = (time) => {
        if (lastFrame !== null && !paused) {
            const limit = maxScroll();

            if (limit > 0) {
                position += speed * ((time - lastFrame) / 1000);

                if (position >= limit) {
                    position = 0;
                }

                track.scrollLeft = position;
            }
        }

        lastFrame = time;
        requestAnimationFrame(move);
    };

    window.addEventListener('resize', () => {
        position = Math.min(position, maxScroll());
    });

    requestAnimationFrame(move);
});
