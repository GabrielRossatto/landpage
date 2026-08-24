const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-section').forEach((section) => observer.observe(section));
}

const glow = document.querySelector('.cursor-glow');

if (glow && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', ({ clientX, clientY }) => {
        glow.style.left = `${clientX}px`;
        glow.style.top = `${clientY}px`;
    });
}

document.querySelectorAll('.reviews-track').forEach((track) => {
    if (reduceMotion) return;

    let paused = false;
    let position = 0;
    let previousTime = 0;
    const speed = 28;
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

    ['mouseenter', 'focusin'].forEach((event) => track.addEventListener(event, () => { paused = true; }));
    ['mouseleave', 'focusout'].forEach((event) => track.addEventListener(event, () => { paused = false; }));

    const animate = (time) => {
        const limit = maxScroll();

        if (previousTime && !paused && limit) {
            position = (position + speed * (time - previousTime) / 1000) % limit;
            track.scrollLeft = position;
        }

        previousTime = time;
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => { position = Math.min(position, maxScroll()); });
    requestAnimationFrame(animate);
});
