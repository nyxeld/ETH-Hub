document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('home-button');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.querySelector('.nav-links');
    const burgerMenu = document.getElementById('burger-menu');
    const pages = document.querySelectorAll('.page-content');
    const backgroundContainer = document.getElementById('background-container');

    const backgroundImages = {
        home: 'home.jpg',
        informatik: 'informatik.png',
        statistik: 'statistik.jpg',
        PC: 'pc.jpg',
        OC: 'oc.png',
        bio: 'biology.jpg',
        bioanalytics: 'bioanalytics.jpg',
        nerd: 'nerd.webp',
        party: 'party.jpg',
    };
    
    // All pages will have the animation now, excluding external links
    const animatablePages = ['informatik', 'statistik', 'PC', 'OC', 'bio', 'bioanalytics', 'nerd', 'party'];

    let animatedImage = null;
    let isReversing = false;
    let placeholder = null;
    let originalParent = null;

    const updateBackground = (pageId) => {
        const imageUrl = backgroundImages[pageId];
        if (imageUrl) {
            backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            backgroundContainer.style.backgroundImage = 'none';
        }
    };

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
        
        if (!isReversing) {
            if (pageId === 'home') {
                resetOtherMemeImages(null);
            } else if (animatedImage) {
                resetOtherMemeImages(animatedImage);
            } else {
                resetOtherMemeImages(null);
            }
        }
    };

    const resetImageStyles = (immediate = false, callback = null) => {
        if (!animatedImage) {
             if (callback) callback();
             return;
        }

        const cleanUpStyles = () => {
            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }

            if (originalParent) {
                originalParent.appendChild(animatedImage);
            }
            
            animatedImage.style.transition = '';
            animatedImage.style.transform = '';
            animatedImage.style.zIndex = '';
            animatedImage.style.position = '';
            animatedImage.style.left = '';
            animatedImage.style.top = '';
            animatedImage.style.margin = '';
            animatedImage.style.filter = '';
            animatedImage.style.display = '';
            
            animatedImage.removeAttribute('data-page-id');
            animatedImage = null;
            isReversing = false;
            
            if (callback) {
                callback();
            }
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

    const initialPageId = window.location.hash.substring(1);

    if (!initialPageId) {
        window.location.hash = 'home';
    } else {
        showPage(initialPageId);
    }

    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = 'home';
        if (window.innerWidth <= 1160) {
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
        }
    });

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });

    const animateTransition = (pageId, href, imgElement) => {
        if (isReversing || !imgElement || !animatablePages.includes(pageId)) {
            if (pageId) {
                window.location.hash = pageId;
            } else if (href) {
                window.location.href = href;
            }
            return;
        }

        resetOtherMemeImages(imgElement);
        animatedImage = imgElement;
        
        originalParent = animatedImage.parentNode;
        const computedStyle = window.getComputedStyle(animatedImage);
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
        animatedImage.dataset.pageId = pageId;
        
        placeholder = document.createElement('div');
        placeholder.style.width = computedStyle.width;
        placeholder.style.height = computedStyle.height;
        placeholder.style.margin = computedStyle.margin;
        placeholder.style.display = 'inline-block';
        placeholder.style.verticalAlign = 'top';

        imgElement.parentNode.insertBefore(placeholder, imgElement);

        animatedImage.style.position = 'fixed';
        animatedImage.style.zIndex = '9999';
        animatedImage.style.left = `${rect.left}px`;
        animatedImage.style.top = `${rect.top}px`;
        animatedImage.style.margin = '0';
        
        animatedImage.style.transition = `transform 0.4s ease-in-out, filter 0.4s ease-in-out`;
        animatedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        animatedImage.style.filter = `contrast(0.7)`;

        setTimeout(() => {
            if (pageId) {
                window.location.hash = pageId;
            } else if (href) {
                window.location.href = href;
            }
        }, 400);
    };

    const startNewTransition = (pageId) => {
        const link = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
        const imgElement = document.querySelector(`#home a[data-page="${pageId}"] .memes`);
        
        if (link && imgElement) {
            animateTransition(pageId, null, imgElement);
        } else {
            window.location.hash = pageId;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = event.target.closest('a').dataset.page;
            const href = event.target.closest('a').getAttribute('href');
            
            const currentPageId = window.location.hash.substring(1);
            
            if (animatablePages.includes(currentPageId) && animatablePages.includes(pageId)) {
                isReversing = true;
                
                resetImageStyles(true, () => {
                    window.location.hash = 'home';
                    setTimeout(() => {
                        startNewTransition(pageId);
                    }, 10);
                });
            } else {
                const imgElement = document.querySelector(`a[data-page="${pageId}"] .memes`);
                animateTransition(pageId, href, imgElement);
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

            animateTransition(pageId, href, imgElement);
        });
    });
});
