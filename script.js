document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.querySelector('.nav-links');
    const burgerMenu = document.getElementById('burger-menu');
    const pages = document.querySelectorAll('.page-content');
    const backgroundContainer = document.getElementById('background-container');
    const iframeContainer = document.querySelector('.iframe-container');

    const backgroundImages = {
        home: 'home.jpg',
        informatik: 'informatik.png',
        statistik: 'statistik.jpg',
        PC: 'pc.jpg',
        OC: 'OC.jpg',
        bio: 'biology.jpg',
        bioanalytics: 'bioanalytics.jpg',
        nerd: 'nerd.webp',
        party: 'party.jpg',
    };

    let animatedImage = null;
    let isReversing = false;

    const updateBackground = (pageId) => {
        const imageUrl = backgroundImages[pageId];
        if (imageUrl) {
            backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            backgroundContainer.style.backgroundImage = 'none';
        }
    };

    // This is the updated reset function.
    // It now takes the current animatedImage as an argument to avoid resetting it.
    const resetOtherMemeImages = (currentAnimatedImage) => {
        document.querySelectorAll('.memes').forEach(img => {
            if (img !== currentAnimatedImage) {
                img.style.transition = '';
                img.style.transform = '';
                img.style.zIndex = '';
                img.style.position = '';
                img.style.left = '';
                img.style.top = '';
                img.style.margin = '';
                img.style.filter = '';
                img.style.display = '';
            }
        });
    };
    
    // The showPage function is modified to call resetOtherMemeImages()
    const showPage = (pageId) => {
        pages.forEach(page => {
            page.classList.remove('active');
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
        });

        const nextPage = document.getElementById(pageId);
        if (nextPage) {
            nextPage.classList.add('active');
            updateBackground(pageId);
            const activeLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        } else {
            document.getElementById('home').classList.add('active');
            updateBackground('home');
            const homeLink = document.querySelector('.nav-links a[data-page="home"]');
            if (homeLink) {
                homeLink.classList.add('active-link');
            }
        }
        
        // This is the new logic: reset all images, but the currently animated one will be set big later.
        if (pageId === 'home') {
             resetOtherMemeImages(null);
        } else if (animatedImage) {
             // Reset all images except the one currently selected
             resetOtherMemeImages(animatedImage);
        } else {
            // In case of a direct URL load, no image is animated yet.
            resetOtherMemeImages(null);
        }
    };

    const resetImageStyles = (immediate = false) => {
        if (!animatedImage) return;

        const cleanUpStyles = () => {
            animatedImage.style.transition = '';
            animatedImage.style.transform = '';
            animatedImage.style.zIndex = '';
            animatedImage.style.position = '';
            animatedImage.style.left = '';
            animatedImage.style.top = '';
            animatedImage.style.margin = '';
            animatedImage.style.filter = '';
            animatedImage.style.display = '';
            animatedImage = null;
            isReversing = false;
        };

        if (!immediate) {
            animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            animatedImage.style.transform = '';
            animatedImage.style.filter = '';
            
            setTimeout(cleanUpStyles, 400);

        } else {
            animatedImage.style.transition = 'none';
            animatedImage.style.transform = `translate(${animatedImage.dataset.translateX}px, ${animatedImage.dataset.translateY}px) scale(${animatedImage.dataset.scale})`;
            animatedImage.style.zIndex = '9999';
            animatedImage.style.position = 'fixed';
            animatedImage.style.left = `${animatedImage.dataset.left}px`;
            animatedImage.style.top = `${animatedImage.dataset.top}px`;
            animatedImage.style.margin = '0';
            animatedImage.style.filter = `contrast(0.7)`;

            animatedImage.offsetHeight; 

            animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            animatedImage.style.transform = '';
            animatedImage.style.filter = '';

            setTimeout(cleanUpStyles, 400);
        }
    };

    const initialPageId = window.location.hash.substring(1) || 'home';
    showPage(initialPageId);

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });

    const animateTransition = (pageId, href) => {
        const animatableLinks = ['informatik', 'statistik', 'PC', 'OC', 'bio', 'bioanalytics'];
        const memeImage = document.querySelector(`a[data-page="${pageId}"] .memes`);
        
        if (isReversing || !animatableLinks.includes(pageId) || !memeImage) {
            if (pageId) {
                window.location.hash = pageId;
            } else if (href) {
                window.location.href = href;
            }
            return;
        }

        // Reset all images except for the one we are about to animate.
        resetOtherMemeImages(memeImage);
        animatedImage = memeImage;

        const rect = animatedImage.getBoundingClientRect();
        const imageCenterX = rect.left + rect.width / 2;
        const imageCenterY = rect.top + rect.height / 2;

        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        const translateX = screenCenterX - imageCenterX;
        const translateY = screenCenterY - imageCenterY;

        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        const scale = Math.max(scaleX, scaleY);
        
        animatedImage.dataset.left = rect.left;
        animatedImage.dataset.top = rect.top;
        animatedImage.dataset.translateX = translateX;
        animatedImage.dataset.translateY = translateY;
        animatedImage.dataset.scale = scale;

        animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
        animatedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        animatedImage.style.zIndex = '9999';
        animatedImage.style.position = 'fixed';
        animatedImage.style.left = `${rect.left}px`;
        animatedImage.style.top = `${rect.top}px`;
        animatedImage.style.margin = '0';
        animatedImage.style.filter = `contrast(0.7)`;

        setTimeout(() => {
            if (pageId) {
                window.location.hash = pageId;
            } else if (href) {
                window.location.href = href;
            }
        }, 400);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const pageId = event.target.closest('a').dataset.page;
            const href = event.target.closest('a').getAttribute('href');

            event.preventDefault();
            
            animateTransition(pageId, href);

            if (window.innerWidth <= 1160) {
                navMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        });
    });

    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.substring(1);
        showPage(pageId);
        
        if (pageId === 'home' && animatedImage) {
            isReversing = true;
            resetImageStyles(true);
        }
    });

    const memesImages = document.querySelectorAll('.memes');

    memesImages.forEach(imageButton => {
        imageButton.addEventListener('click', (event) => {
            event.preventDefault();

            const link = event.target.closest('a');
            const href = link.getAttribute('href');
            const pageId = link.dataset.page;
            const imgElement = imageButton;

            if (isReversing) return;

            // Reset all images except for the one we are about to animate.
            resetOtherMemeImages(imgElement);
            animatedImage = imgElement;

            const rect = animatedImage.getBoundingClientRect();
            const imageCenterX = rect.left + rect.width / 2;
            const imageCenterY = rect.top + rect.height / 2;

            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            const translateX = screenCenterX - imageCenterX;
            const translateY = screenCenterY - imageCenterY;

            const scaleX = window.innerWidth / rect.width;
            const scaleY = window.innerHeight / rect.height;
            const scale = Math.max(scaleX, scaleY);
            
            animatedImage.dataset.left = rect.left;
            animatedImage.dataset.top = rect.top;
            animatedImage.dataset.translateX = translateX;
            animatedImage.dataset.translateY = translateY;
            animatedImage.dataset.scale = scale;

            animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            animatedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            animatedImage.style.zIndex = '9999';
            animatedImage.style.position = 'fixed';
            animatedImage.style.left = `${rect.left}px`;
            animatedImage.style.top = `${rect.top}px`;
            animatedImage.style.margin = '0';
            animatedImage.style.filter = `contrast(0.7)`;

            setTimeout(() => {
                if (pageId) {
                    window.location.hash = pageId;
                } else if (href) {
                    window.location.href = href;
                }
            }, 400);
        });
    });
});