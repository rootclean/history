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

    // ===== Разбиваем текст на буквы (эффект «Символы») =====
    function splitIntoChars(el) {
        if (!el) return;
        if (el.dataset.split === 'true') return;  // уже разбито
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
        el.dataset.split = 'true';
    }

    // Сброс анимации букв (чтобы при возврате на финальный слайд снова сыграло)
    function resetChars(el) {
        if (!el) return;
        el.dataset.split = 'false';
        el.textContent = el.dataset.originalText || el.textContent;
    }

    // Запоминаем оригинальный текст заголовка
    if (morphTitle) {
        morphTitle.dataset.originalText = morphTitle.textContent;
    }

    // Плавная анимация элементов слайда (для обычных переходов)
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

        // ===== МОРФ-ПЕРЕХОД при движении на последний слайд =====
        if (goingToLast) {
            isAnimating = true;
            const oldSlide = slides[currentIndex];
            const newSlide = slides[index];
            const oldIndex = currentIndex;

            // Оба слайда активны одновременно — «перетекают» друг в друга
            oldSlide.classList.add('morph-out');
            newSlide.classList.add('active', 'morph-in');

            // Лёгкая тряска + вспышка синхронно с морфом
            presentation.classList.add('party-shake');
            document.body.classList.add('party-flash');

            // Обновляем точки и счётчик сразу
            dots[oldIndex].classList.remove('active');
            dots[index].classList.add('active');
            currentIndex = index;
            currentEl.textContent = currentIndex + 1;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;

            // Сбрасываем разбивку букв и заново разбиваем — чтобы проигралось каждый раз
            if (morphTitle) {
                morphTitle.dataset.split = 'false';
                morphTitle.textContent = morphTitle.dataset.originalText;
                // Небольшая задержка, чтобы анимация пошла уже после морфа
                setTimeout(() => splitIntoChars(morphTitle), 500);
            }

            // Финализация
            setTimeout(() => {
                oldSlide.classList.remove('active', 'morph-out');
                newSlide.classList.remove('morph-in');
                presentation.classList.remove('party-shake');
                document.body.classList.remove('party-flash');
                animateChildren(newSlide);
                isAnimating = false;
            }, 950);

            return;
        }

        // ===== ОБЫЧНЫЙ переход =====
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

    // Клавиатура
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

    // Свайпы
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
