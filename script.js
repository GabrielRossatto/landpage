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
