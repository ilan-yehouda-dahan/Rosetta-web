// JavaScript amélioré pour votre site Roseta

document.addEventListener('DOMContentLoaded', function() {

    // 1. Gestion du header sticky avec effet de fond
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Auto-hide header lors du scroll vers le bas (optionnel)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // 2. Navigation sticky du menu avec indicateur de section active
    const menuNavLinks = document.querySelectorAll('.menu-nav a');
    const sections = document.querySelectorAll('.menu h3');

    function updateActiveSection() {
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.id;
            }
        });

        menuNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveSection);

    // 3. Smooth scroll amélioré pour la navigation du menu
    menuNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const menuNavHeight = document.querySelector('.menu-nav').offsetHeight;
                const offsetTop = targetSection.offsetTop - headerHeight - menuNavHeight - 20;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Lazy loading des images avec animation
    const images = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.setAttribute('data-loaded', 'false');

                // Simulation d'un chargement
                setTimeout(() => {
                    img.setAttribute('data-loaded', 'true');
                }, 300);

                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 5. Animation des éléments lors du scroll
    const animateElements = document.querySelectorAll('.menu li, .gallery-item');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => animateObserver.observe(el));

    // 6. Gestion du menu mobile amélioré
    const menuBtn = document.getElementById('menu-btn');
    const menuMobile = document.querySelector('.menu-mobile');
    const menuMobileLinks = document.querySelectorAll('.menu-mobile a');

    menuMobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.checked = false;
        });
    });

    // 7. Preloader de page
    function showPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }

    // Uncomment to activate page loader
    // showPageLoader();

    // 8. Filtrage du menu (bonus feature)
    function addMenuFilter() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'menu-filter';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">Tout voir</button>
            <button class="filter-btn" data-filter="pizza">Pizzas</button>
            <button class="filter-btn" data-filter="pasta">Pâtes</button>
            <button class="filter-btn" data-filter="antipasti">Antipasti</button>
        `;

        const menuSection = document.querySelector('.menu');
        if (menuSection) {
            menuSection.insertBefore(filterContainer, menuSection.firstChild);
        }

        // Logique de filtrage
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter menu sections
                const menuSections = document.querySelectorAll('.menu h3');
                menuSections.forEach(section => {
                    const sectionId = section.id;
                    const sectionContainer = section.parentNode;

                    if (filter === 'all') {
                        sectionContainer.style.display = 'block';
                    } else if (sectionId.includes(filter)) {
                        sectionContainer.style.display = 'block';
                    } else {
                        sectionContainer.style.display = 'none';
                    }
                });
            });
        });
    }

    // Uncomment to add menu filtering
    // addMenuFilter();

    // 9. Partage social
    function addSocialShare() {
        const shareBtn = document.createElement('div');
        shareBtn.className = 'social-share-btn';
        shareBtn.innerHTML = `
            <button id="shareBtn" title="Partager cette page">📱</button>
        `;

        document.body.appendChild(shareBtn);

        document.getElementById('shareBtn').addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        text: 'Découvrez le restaurant Roseta !',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Erreur lors du partage:', err);
                }
            } else {
                // Fallback: copier l'URL
                navigator.clipboard.writeText(window.location.href);
                alert('URL copiée dans le presse-papier !');
            }
        });
    }

    // Uncomment to add social sharing
    // addSocialShare();

    // 10. Amélioration de Lightbox (si vous utilisez lightbox)
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': false,
            'fadeDuration': 300
        });
    }

    // 11. Gestion des erreurs d'images
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'images/placeholder.jpg'; // Image de fallback
            this.alt = 'Image non disponible';
        });
    });

    // 12. Optimisation des performances - Debounce pour les événements scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Appliquer le debounce aux événements scroll
    const debouncedScrollHandler = debounce(() => {
        updateActiveSection();
    }, 10);

    window.removeEventListener('scroll', updateActiveSection);
    window.addEventListener('scroll', debouncedScrollHandler);



});

// CSS pour les fonctionnalités JavaScript - À ajouter dans votre fichier CSS
const additionalCSS = `
.menu-filter {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.filter-btn {
    background: #f0f0f0;
    border: none;
    padding: 8px 15px;
    margin: 0 5px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.filter-btn:hover {
    background: var(--primary-color);
    color: white;
}

.filter-btn.active {
    background: var(--secondary-color);
    color: white;
}

.social-share-btn {
    position: fixed;
    bottom: 100px;
    right: 30px;
    z-index: 999;
}

.social-share-btn button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: var(--accent-color);
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

.social-share-btn button:hover {
    transform: scale(1.1);
    background: var(--secondary-color);
}
`;
// Corrections JavaScript pour mobile - À ajouter à vos scripts

document.addEventListener('DOMContentLoaded', function() {

    // 1. Détection mobile
    const isMobile = window.innerWidth <= 768;

    // 2. Fix du viewport mobile (évite le zoom sur les input)
    if (isMobile) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }

    // 3. Fermeture automatique du menu mobile lors du scroll
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (isMobile && !isScrolling) {
            const menuBtn = document.getElementById('menu-btn');
            if (menuBtn && menuBtn.checked) {
                menuBtn.checked = false;
            }
        }
    });

    // 4. Amélioration du smooth scroll sur mobile
    if (isMobile) {
        const menuLinks = document.querySelectorAll('.menu-nav a[href^="#"]');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = 60; // Header mobile height
                    const menuNavHeight = 50; // Menu nav mobile height
                    const offset = targetElement.offsetTop - headerHeight - menuNavHeight - 10;

                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 5. Prévenir le scroll du body quand le menu mobile est ouvert
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn && isMobile) {
        menuBtn.addEventListener('change', function() {
            if (this.checked) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        });
    }

    // 6. Optimisation des images pour mobile
    if (isMobile) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Loading lazy pour économiser la bande passante
            img.setAttribute('loading', 'lazy');

            // Réduire la qualité sur mobile si nécessaire
            if (img.src && img.src.includes('.jpg')) {
                // Vous pouvez créer des versions mobile de vos images
                // img.src = img.src.replace('.jpg', '_mobile.jpg');
            }
        });
    }

    // 7. Touch gestures pour la galerie (optionnel)
    if (isMobile) {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;

            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;

            // Swipe horizontal pour navigation (si vous voulez ajouter cette fonctionnalité)
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    // Swipe left
                } else if (diffX < -50) {
                    // Swipe right
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    // 8. Resize handler pour ajuster l'affichage
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newIsMobile = window.innerWidth <= 768;

            // Réinitialiser les styles si on passe de mobile à desktop ou vice versa
            if (newIsMobile !== isMobile) {
                location.reload();
            }
        }, 250);
    });

    // 9. Fix pour Safari iOS (problème de hauteur viewport)
    if (isMobile && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    // 10. Performance - Débounce du scroll
    let ticking = false;
    function updateOnScroll() {
        // Vos fonctions de scroll ici
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
});

// CSS pour Safari iOS (à ajouter dans votre CSS)
const safariIOSStyles = `
@supports (-webkit-touch-callout: none) {
    .menu-mobile {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
}
`;

// Injecter les styles Safari iOS
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const style = document.createElement('style');
    style.textContent = safariIOSStyles;
    document.head.appendChild(style);
}