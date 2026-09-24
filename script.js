document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');
    const currentEl = document.getElementById('current');
    const totalEl = document.getElementById('total');
    const presentation = document.querySelector('.presentation');

    let currentIndex = 0;
    let isAnimating = false;
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

    // Запуск эмодзи-фейерверка
    function triggerEmojis() {
        const emojis = ['🎉', '🎊', '😈', '💥', '⚡', '🔥', '💫', '🎈', '🥳', '😼'];

        for (let i = 0; i < 14; i++) {
            const emoji = document.createElement('div');
            emoji.classList.add('flying-emoji');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 350;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rot = (Math.random() * 720 - 360) + 'deg';

            emoji.style.setProperty('--tx', tx + 'px');
            emoji.style.setProperty('--ty', ty + 'px');
            emoji.style.setProperty('--rot', rot);
            emoji.style.animationDelay = (Math.random() * 0.4 + 0.2) + 's';
            emoji.style.fontSize = (1.8 + Math.random() * 2) + 'rem';

            document.body.appendChild(emoji);

            setTimeout(() => emoji.remove(), 2800);
        }
    }

    // Плавная анимация элементов слайда
    function animateChildren(slide) {
        const children = slide.querySelectorAll('.text, .card, .timeline li, .image-block, .author-block, .rickroll');
        children.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + i * 60);
        });
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        if (index === currentIndex) return;
        if (isAnimating) return;

        const goingToLast = (index === totalSlides - 1);

        // === ВОРОНКА (при переходе на последний слайд) ===
        if (goingToLast) {
            isAnimating = true;
            const oldSlide = slides[currentIndex];
            const newSlide = slides[index];
            const oldIndex = currentIndex;

            // 1. Старый слайд закручивается + тряска + вспышка
            oldSlide.classList.add('funnel-out');
            presentation.classList.add('party-shake');
            document.body.classList.add('party-flash');

            // 2. В середине анимации подменяем слайд
            setTimeout(() => {
                oldSlide.classList.remove('active', 'funnel-out');
                dots[oldIndex].classList.remove('active');

                currentIndex = index;
                newSlide.classList.add('active', 'funnel-in');
                dots[currentIndex].classList.add('active');
                currentEl.textContent = currentIndex + 1;
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === totalSlides - 1;

                // 3. Эмодзи летят, пока новый слайд выкручивается
                triggerEmojis();

                setTimeout(() => {
                    newSlide.classList.remove('funnel-in');
                    presentation.classList.remove('party-shake');
                    document.body.classList.remove('party-flash');
                    animateChildren(newSlide);
                    isAnimating = false;
                }, 850);

            }, 550);

            return;
        }

        // === ОБЫЧНЫЙ переход ===
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        currentEl.textContent = currentIndex + 1;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;

        animateChildren(slides[currentIndex]);
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Управление с клавиатуры
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

    // Свайпы для мобильных
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
});
