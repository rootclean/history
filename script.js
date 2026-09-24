document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');
    const currentEl = document.getElementById('current');
    const totalEl = document.getElementById('total');
    const presentation = document.querySelector('.presentation');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Создаём точки индикации
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');
    totalEl.textContent = totalSlides;

    function triggerParty() {
        presentation.classList.add('party-shake');
        document.body.classList.add('party-flash');

        const emojis = ['🎉', '🎊', '😈', '💥', '⚡', '🔥', '💫', '🎈', '🥳', '😼'];

        for (let i = 0; i < 22; i++) {
            const emoji = document.createElement('div');
            emoji.classList.add('flying-emoji');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = 250 + Math.random() * 400;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rot = (Math.random() * 720 - 360) + 'deg';

            emoji.style.setProperty('--tx', tx + 'px');
            emoji.style.setProperty('--ty', ty + 'px');
            emoji.style.setProperty('--rot', rot);
            emoji.style.animationDelay = (Math.random() * 0.3) + 's';
            emoji.style.fontSize = (2 + Math.random() * 2.5) + 'rem';

            document.body.appendChild(emoji);

            setTimeout(() => emoji.remove(), 2600);
        }

        setTimeout(() => {
            presentation.classList.remove('party-shake');
            document.body.classList.remove('party-flash');
        }, 900);
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        if (index === currentIndex) return;

        const goingToLast = (index === totalSlides - 1);

        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        currentEl.textContent = currentIndex + 1;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;

        if (goingToLast) {
            triggerParty();
        }
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Home') {
            goToSlide(0);
        } else if (e.key === 'End') {
            goToSlide(totalSlides - 1);
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        if (touchEndX - touchStartX > 50) prevSlide();
    });

    prevBtn.disabled = true;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.target.classList.contains('active')) {
                const children = m.target.querySelectorAll('.text, .card, .timeline li, .image-block, .author-block, .rickroll');
                children.forEach((el, i) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 100 + i * 80);
                });
            }
        });
    });

    slides.forEach(slide => observer.observe(slide, { attributes: true, attributeFilter: ['class'] }));
});
