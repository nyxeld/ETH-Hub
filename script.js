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
        PC: 'PC.jpg',
        OC: 'OC.jpg',
        bio: 'biology.jpg',
        bioanalytics: 'bioanalytics.jpg',
        nerd: 'nerd.webp',
        party: 'party.jpg',
    };

    let animatedImage = null; // Variable to store the currently animated image
    let isReversing = false;

    const updateBackground = (pageId) => {
        const imageUrl = backgroundImages[pageId];
        if (imageUrl) {
            backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            backgroundContainer.style.backgroundImage = 'none';
        }
    };

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
    };

    const resetImageStyles = (immediate = false) => {
        if (!animatedImage) return;

        // Animate the reset if not immediate
        if (!immediate) {
            animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            animatedImage.style.transform = '';
            animatedImage.style.zIndex = '';
            animatedImage.style.position = '';
            animatedImage.style.left = '';
            animatedImage.style.top = '';
            animatedImage.style.margin = '';
            animatedImage.style.filter = '';
            
            // Wait for transition to finish before clearing the reference
            setTimeout(() => {
                animatedImage = null;
                isReversing = false;
            }, 400);

        } else {
            // Immediately reset styles for the initial state before animating back out
            animatedImage.style.transition = 'none'; // Disable transition for the immediate change
            animatedImage.style.transform = `translate(${animatedImage.dataset.translateX}px, ${animatedImage.dataset.translateY}px) scale(${animatedImage.dataset.scale})`;
            animatedImage.style.zIndex = '9999';
            animatedImage.style.position = 'fixed';
            animatedImage.style.left = `${animatedImage.dataset.left}px`;
            animatedImage.style.top = `${animatedImage.dataset.top}px`;
            animatedImage.style.margin = '0';
            animatedImage.style.filter = `contrast(0.7)`;

            // Force a reflow to apply the non-transitioned styles
            animatedImage.offsetHeight; 

            // Now, apply the transition and reset the transform
            animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            animatedImage.style.transform = '';
            animatedImage.style.zIndex = '';
            animatedImage.style.position = '';
            animatedImage.style.left = '';
            animatedImage.style.top = '';
            animatedImage.style.margin = '';
            animatedImage.style.filter = '';

            setTimeout(() => {
                animatedImage = null;
                isReversing = false;
            }, 400);
        }
    };

    const initialPageId = window.location.hash.substring(1) || 'home';
    showPage(initialPageId);

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const pageId = event.target.closest('a').dataset.page;

            if (pageId) {
                event.preventDefault();
                window.location.hash = pageId;
            }

            if (window.innerWidth <= 1160) {
                navMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        });
    });

    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.substring(1);
        showPage(pageId);
        
        // Trigger the zoom-out animation when returning to the home page
        if (pageId === 'home' && animatedImage) {
            isReversing = true;
            resetImageStyles(true); // Call with `true` to trigger the zoom-out
        }
    });

    // Code for meme image animation
    const memesImages = document.querySelectorAll('.memes');

    memesImages.forEach(imageButton => {
        imageButton.addEventListener('click', (event) => {
            event.preventDefault();

            const link = event.target.closest('a');
            const href = link.getAttribute('href');
            const pageId = link.dataset.page;
            const imgElement = imageButton;

            // Only animate if another animation isn't in progress
            if (isReversing) return;

            animatedImage = imgElement;

            const rect = imgElement.getBoundingClientRect();
            const imageCenterX = rect.left + rect.width / 2;
            const imageCenterY = rect.top + rect.height / 2;

            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            const translateX = screenCenterX - imageCenterX;
            const translateY = screenCenterY - imageCenterY;

            const scaleX = window.innerWidth / rect.width;
            const scaleY = window.innerHeight / rect.height;
            const scale = Math.max(scaleX, scaleY);
            
            // Store the initial state in data attributes
            imgElement.dataset.left = rect.left;
            imgElement.dataset.top = rect.top;
            imgElement.dataset.translateX = translateX;
            imgElement.dataset.translateY = translateY;
            imgElement.dataset.scale = scale;

            imgElement.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
            imgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            imgElement.style.zIndex = '9999';
            imgElement.style.position = 'fixed';
            imgElement.style.left = `${rect.left}px`;
            imgElement.style.top = `${rect.top}px`;
            imgElement.style.margin = '0';
            imgElement.style.filter = `contrast(0.7)`;

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
