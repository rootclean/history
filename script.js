document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');
    const currentEl = document.getElementById('current');
    const totalEl = document.getElementById('total');
    const presentation = document.querySelector('.presentation');
    const morphTitle = document.querySelector('.morph-title');

    let currentIndex = 0;
    let isAnimating = false;
    const totalSlides = slides.length;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');
    totalEl.textContent = totalSlides;

    // ===== Разбиваем заголовок на буквы СРАЗУ при загрузке =====
    // Так пользователь никогда не увидит «сырой» текст —
    // буквы изначально невидимы (opacity: 0 через CSS),
    // и включаются только когда на слайде появляется класс .active.
    function splitIntoChars(el) {
        if (!el) return;
        const text = el.textContent;
        el.innerHTML = '';
        [...text].forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            if (ch === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = ch;
            }
            span.style.animationDelay = (0.35 + i * 0.045) + 's';
            el.appendChild(span);
        });
    }

    if (morphTitle) splitIntoChars(morphTitle);

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

        // ===== MORPH при переходе на последний слайд =====
        if (goingToLast) {
            isAnimating = true;
            const oldSlide = slides[currentIndex];
            const newSlide = slides[index];
            const oldIndex = currentIndex;

            oldSlide.classList.add('morph-out');
            // Добавляем .active — именно это включает и morph-in, и анимацию букв
            newSlide.classList.add('active', 'morph-in');

            presentation.classList.add('party-shake');
            document.body.classList.add('party-flash');

            dots[oldIndex].classList.remove('active');
            dots[index].classList.add('active');
            currentIndex = index;
            currentEl.textContent = currentIndex + 1;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;

            setTimeout(() => {
                oldSlide.classList.remove('active', 'morph-out');
                newSlide.classList.remove('morph-in');
                presentation.classList.remove('party-shake');
                document.body.classList.remove('party-flash');
                // «67 кликни 67» — одиночный элемент, анимируем как обычно
                const rick = newSlide.querySelector('.rickroll');
                if (rick) {
                    rick.style.opacity = '0';
                    rick.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        rick.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        rick.style.opacity = '1';
                        rick.style.transform = 'translateY(0)';
                    }, 200);
                }
                isAnimating = false;
            }, 950);

            return;
        }

        // ===== Обычный переход =====
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
});
