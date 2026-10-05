const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

// Revela cada seção com fade ao entrar na tela.
function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-section').forEach((section) => observer.observe(section));
}

// Brilho que acompanha o cursor.
function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    document.addEventListener('pointermove', ({ clientX, clientY }) => {
        glow.style.left = `${clientX}px`;
        glow.style.top = `${clientY}px`;
    });
}

// Desenha a linha que sai do card "Projeto" da hero e termina no botão principal.
function initHeroConnector() {
    const connector = document.querySelector('.hero-connector');
    const project = document.querySelector('.art-project');
    const button = document.querySelector('.hero-content .btn');
    if (!connector || !project || !button) return;

    const path = connector.querySelector('path');
    const arrow = connector.querySelector('polyline');
    const dot = connector.querySelector('circle');

    const draw = () => {
        if (getComputedStyle(connector).display === 'none') return;

        const hero = connector.parentElement.getBoundingClientRect();
        const projectRect = project.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const startX = projectRect.left + projectRect.width / 2 - hero.left;
        const startY = projectRect.bottom - hero.top + 8;
        const endX = buttonRect.right - hero.left + 14;
        const endY = buttonRect.top + buttonRect.height / 2 - hero.top;
        const radius = Math.min(18, Math.max(0, endY - startY));

        path.setAttribute('d', `M${startX} ${startY} V${endY - radius} Q${startX} ${endY} ${startX - radius} ${endY} H${endX}`);
        arrow.setAttribute('points', `${endX + 8} ${endY - 7} ${endX} ${endY} ${endX + 8} ${endY + 7}`);
        dot.setAttribute('cx', startX);
        dot.setAttribute('cy', startY);
    };

    draw();
    window.addEventListener('resize', draw);
    window.addEventListener('load', draw);
    document.querySelectorAll('.hero-art').forEach((art) => art.addEventListener('transitionend', draw));
}

// Inclina as composições da hero conforme a posição do mouse na tela.
function initHeroTilt() {
    const heroArt = document.querySelectorAll('.hero-art');

    document.addEventListener('pointermove', ({ clientX, clientY }) => {
        const tiltY = (clientX / window.innerWidth - 0.5) * 12;
        const tiltX = (0.5 - clientY / window.innerHeight) * 8;

        heroArt.forEach((art) => {
            art.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
            art.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        });
    });
}

// Inclina cada card .tilt na direção do cursor.
function initCardTilt() {
    const maxTilt = 8;

    document.querySelectorAll('.tilt').forEach((card) => {
        card.addEventListener('pointermove', ({ clientX, clientY }) => {
            const rect = card.getBoundingClientRect();
            const x = (clientX - rect.left) / rect.width - 0.5;
            const y = (clientY - rect.top) / rect.height - 0.5;

            card.style.setProperty('--ry', `${(x * maxTilt).toFixed(2)}deg`);
            card.style.setProperty('--rx', `${(-y * maxTilt).toFixed(2)}deg`);
        });

        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
}

// Rola os projetos sozinho, pausando quando o usuário interage.
function initReviewsAutoScroll() {
    const speed = 28; // px por segundo

    document.querySelectorAll('.reviews-track').forEach((track) => {
        let paused = false;
        let position = 0;
        let previousTime = 0;
        const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

        ['mouseenter', 'focusin'].forEach((event) => track.addEventListener(event, () => { paused = true; }));
        ['mouseleave', 'focusout'].forEach((event) => track.addEventListener(event, () => { paused = false; }));
        window.addEventListener('resize', () => { position = Math.min(position, maxScroll()); });

        const animate = (time) => {
            const limit = maxScroll();

            if (previousTime && !paused && limit) {
                position = (position + speed * (time - previousTime) / 1000) % limit;
                track.scrollLeft = position;
            }

            previousTime = time;
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    });
}

initHeroConnector();

if (canHover) initCursorGlow();

if (!reduceMotion) {
    initFadeIn();
    initReviewsAutoScroll();

    if (canHover) {
        initHeroTilt();
        initCardTilt();
    }
}
