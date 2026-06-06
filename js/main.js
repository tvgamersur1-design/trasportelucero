// Calcular próxima salida automáticamente
function calculateNextDeparture() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convertir a minutos desde medianoche
    
    // Horarios de salida en minutos desde medianoche
    const departures = [
        { time: 1 * 60 + 30, label: "1:30 AM", period: "Madrugada", phone: "950863131" },      // 1:30 AM = 90 min
        { time: 2 * 60 + 0, label: "2:00 AM", period: "Madrugada", phone: "950863131" },       // 2:00 AM = 120 min
        { time: 13 * 60 + 30, label: "1:30 PM", period: "Tarde", phone: "980333214" },         // 1:30 PM = 810 min
        { time: 14 * 60 + 30, label: "2:30 PM", period: "Tarde", phone: "980333214" }          // 2:30 PM = 870 min
    ];
    
    let nextDeparture = null;
    
    // Buscar la próxima salida del día
    for (let departure of departures) {
        if (currentTime < departure.time) {
            nextDeparture = departure;
            break;
        }
    }
    
    // Si no hay más salidas hoy, la próxima es la primera de mañana
    if (!nextDeparture) {
        nextDeparture = departures[0];
        return {
            text: `Mañana - ${nextDeparture.label}`,
            period: nextDeparture.period,
            phone: nextDeparture.phone,
            isTomorrow: true
        };
    }
    
    return {
        text: `Hoy - ${nextDeparture.label}`,
        period: nextDeparture.period,
        phone: nextDeparture.phone,
        isTomorrow: false
    };
}

function updateNextDeparture() {
    const departureElement = document.getElementById('nextDeparture');
    const whatsappBtn = document.getElementById('heroWhatsAppBtn');
    
    if (departureElement) {
        const nextDep = calculateNextDeparture();
        departureElement.textContent = nextDep.text;
        
        // Actualizar el botón de WhatsApp con el número correcto
        if (whatsappBtn) {
            const message = encodeURIComponent('Hola, quisiera información sobre la próxima salida');
            whatsappBtn.href = `https://wa.me/51${nextDep.phone}?text=${message}`;
            
            // Opcional: cambiar el texto del botón
            const periodLabel = nextDep.period === 'Madrugada' ? '(Madrugada)' : '(Tarde)';
            // whatsappBtn.querySelector('span:last-child').textContent = `WhatsApp ${periodLabel}`;
        }
        
        // Opcional: agregar clase para animar el cambio
        departureElement.classList.add('updated');
        setTimeout(() => {
            departureElement.classList.remove('updated');
        }, 500);
    }
}

// Funciones para el modal de contacto
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Carrusel de Flota
let currentSlide = 0;
let carouselInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!slides.length) return;
    
    // Resetear índice si está fuera de rango
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    // Actualizar slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    // Actualizar indicadores
    indicators.forEach((indicator, i) => {
        indicator.classList.remove('active');
        if (i === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
    resetCarouselInterval();
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
    resetCarouselInterval();
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    resetCarouselInterval();
}

function startCarousel() {
    carouselInterval = setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 4000); // Cambiar cada 4 segundos
}

function resetCarouselInterval() {
    clearInterval(carouselInterval);
    startCarousel();
}

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Calcular y mostrar próxima salida
    updateNextDeparture();
    // Actualizar cada minuto
    setInterval(updateNextDeparture, 60000);
    
    // Observar todos los elementos con animación
    const elementsToAnimate = document.querySelectorAll('.fade-in-scroll, .stat-item, .map-container');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Cerrar modal al hacer clic fuera
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target.id === 'contactModal') {
                closeContactModal();
            }
        });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeContactModal();
        }
    });

    // Iniciar carrusel automático
    const carousel = document.getElementById('fleetCarousel');
    if (carousel) {
        showSlide(0);
        startCarousel();
        
        // Pausar carrusel al pasar el mouse
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        // Reanudar carrusel al quitar el mouse
        carousel.addEventListener('mouseleave', () => {
            startCarousel();
        });
        
        // Soporte para gestos de swipe en móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(carouselInterval); // Pausar durante el swipe
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startCarousel(); // Reiniciar después del swipe
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // Swipe izquierda - siguiente slide
                    nextSlide();
                } else {
                    // Swipe derecha - slide anterior
                    prevSlide();
                }
            }
        }
    }
});
