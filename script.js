    document.addEventListener('DOMContentLoaded', () => {
    const homeButtons = document.querySelectorAll('.home-button');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.querySelector('.nav-links');
    const burgerMenu = document.getElementById('burger-menu');
    const pages = document.querySelectorAll('.page-content');
    const backgroundContainer = document.getElementById('background-container');
    const memesImages = document.querySelectorAll('.memes, .apps');

    // Create a new div element for the overlay
    const overlay = document.createElement('div');
    overlay.id = 'animation-overlay';
    document.body.appendChild(overlay);
    
    let animatablePages = []; 
    if (window.location.href.includes('/ersti')) {
        animatablePages = ['mathe', 'AC', 'physik', 'OC', 'bio', 'nerd', 'extra'];
    } else {
        animatablePages = ['informatik', 'statistik', 'PC', 'OC', 'bio', 'bioanalytics', 'nerd', 'extra'];
    }
    
    let animatedImage = null;
    let isReversing = false;
    let placeholder = null;
    let originalParent = null;

    const lockUI = () => {
        overlay.style.display = 'block';
    };

    const unlockUI = () => {
        overlay.style.display = 'none';
    };

    const updateBackground = (pageId, animatedImageElement = null) => {
        let imageUrl;

        if (animatedImageElement) {
            imageUrl = animatedImageElement.src;
        } else {
            if (window.location.href.includes('/ersti') || window.location.href.includes('/dritti')) {
                imageUrl = '../img/home.webp';
            } else {
                imageUrl = './img/home.webp';
            }
        }
        if (imageUrl) {
            backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            backgroundContainer.style.backgroundImage = 'none';
        }
    };

    const showPage = (pageId, animatedImageElement = null) => {
        pages.forEach(page => {
            page.classList.remove('active');
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
        });

        const nextPage = document.getElementById(pageId);
        if (nextPage) {
            nextPage.classList.add('active');
            updateBackground(pageId, animatedImageElement);
            const activeLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        } else {
            document.getElementById('home').classList.add('active');
            updateBackground('home');
            window.location.hash = 'home';
            const homeLink = document.querySelector('.nav-links a[data-page="home"]');
            if (homeLink) {
                homeLink.classList.add('active-link');
            }
        }

        if (!isReversing) {
            if (pageId === 'home') {
                resetOtherMemeImages(null);
            } else {
                resetOtherMemeImages(null);
            }
        }
    };

    const resetImageStyles = (callback = null) => {

        const cleanUpStyles = () => {
            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }
            if (originalParent && animatedImage) {
                originalParent.appendChild(animatedImage);

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
            }

            animatedImage = null;
            isReversing = false;
            unlockUI();

            if (callback) {
                callback();
            }
        };

        animatedImage.style.transition = 'none';
        animatedImage.style.transform = `translate(${animatedImage.dataset.translateX}px, ${animatedImage.dataset.translateY}px) scale(${animatedImage.dataset.scale})`;
        animatedImage.style.zIndex = '9999';
        animatedImage.style.position = 'fixed';
        animatedImage.style.left = `${animatedImage.dataset.left}px`;
        animatedImage.style.top = `${animatedImage.dataset.top}px`;
        animatedImage.style.margin = '0';
        animatedImage.style.filter = `contrast(0.5)`;

        animatedImage.offsetHeight;

        animatedImage.style.transition = `transform 0.2s ease-in-out, filter 0.2s ease-in-out`;
        animatedImage.style.transform = '';
        animatedImage.style.filter = '';

        setTimeout(cleanUpStyles, 200);
    };

    const resetOtherMemeImages = (currentAnimatedImage) => {
        document.querySelectorAll('.memes, .apps').forEach(img => {
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

    const hashChangeHandler = () => {
        showPage('home');
        const pageId = window.location.hash.substring(1);
        if (pageId !== 'home') {
            if (pageId === 'reels' || pageId === 'wirdichbestah') {
                showPage(pageId);
                return;
            }
            location.reload();
            animatedImage = document.querySelector(`#home a[data-page="${pageId}"] .memes, #home a[data-page="${pageId}"] .apps`);
        }
        if (animatedImage) {
            isReversing = true;
            lockUI();
            resetImageStyles();
        }
    };

    const initialPageId = window.location.hash.substring(1);
    if (animatablePages.includes(initialPageId)) {
        window.location.hash = 'home';
        setTimeout(() => {
            startNewTransition(initialPageId);
        }, 0);
    } else {
        window.location.hash = 'home';
        showPage('home');
    }

    homeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.hash = 'home';
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
        });
    });

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });

    const animateTransition = (pageId, href, imgElement) => {
        // Check if the UI is locked
        if (overlay.style.display === 'block') {
            return;
        }

        lockUI(); // Lock the UI at the start of the animation

        resetOtherMemeImages(imgElement);
        animatedImage = imgElement;

        originalParent = animatedImage.parentNode;

        //Make the placeholder to make sure the formatting stays consistent
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

        animatedImage.style.transition = `transform 0.2s ease-in-out, filter 0.2s ease-in-out`;
        animatedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        animatedImage.style.filter = `contrast(0.5)`;

        setTimeout(() => {
            if (pageId) {
                window.removeEventListener('hashchange', hashChangeHandler);
                showPage(pageId, imgElement);
                window.location.hash = pageId;
                setTimeout(() => {
                    window.addEventListener('hashchange', hashChangeHandler);
                }, 0);
            } else if (href) {
                if (href === "https://webprint.ethz.ch/user?1#page-main") {
                    const userConfirmed = confirm("Make sure you're on ETH Wi-Fi/VPN and not using another VPN before loading this page.");
                    if (userConfirmed) {
                        window.open(href);
                    }
                } else if (href.includes('./') && href.includes('html')) {
                    window.location.href = href;
                } else {
                    window.open(href);
                }
                setTimeout(() => location.reload(),100);
            }
            unlockUI();
        }, 200);
    };

    const startNewTransition = (pageId) => {
        const link = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
        const imgElement = document.querySelector(`#home a[data-page="${pageId}"] .memes, #home a[data-page="${pageId}"] .apps`);

        if (link && imgElement) {
            animateTransition(pageId, null, imgElement);
        } else {
            window.location.hash = pageId;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const pageId = event.target.closest('a').dataset.page;
            const href = event.target.closest('a').getAttribute('href');

            // Check if the UI is locked
            if (overlay.style.display === 'block') {
                event.preventDefault();
                return;
            }

            event.preventDefault();

            const currentPageId = window.location.hash.substring(1);
            if (currentPageId !== pageId) {
                if (animatablePages.includes(currentPageId) && animatablePages.includes(pageId)) {
                    lockUI(); // Lock the UI for the transition
                    window.location.hash = 'home';
                    isReversing = true;
    
                    resetImageStyles( () => {
                        setTimeout(() => {
                            startNewTransition(pageId);
                        }, 100);
                    });
                } else {
                    const imgElement = document.querySelector(`a[data-page="${pageId}"] .memes, a[data-page="${pageId}"] .apps`);
                    animateTransition(pageId, href, imgElement);
                }
            }
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
        });
    });

    window.addEventListener('hashchange', hashChangeHandler);


    const handleLink = (link, imgElement) => {
        // Check if the UI is locked
        if (overlay.style.display === 'block') {
            return;
        }

        const href = link.getAttribute('href');
        const pageId = link.dataset.page;

        animateTransition(pageId, href, imgElement);
    };
        
    memesImages.forEach(imageButton => {
        imageButton.addEventListener('click', (event) => {

            const link = event.target.closest('a');
            const imgElement = imageButton;

            event.preventDefault();
            
            if (isReversing) return;
            handleLink(link, imgElement);
        });
    });

    let lastKeyPressed = null;
    
    // The event listener now only updates a variable
    document.addEventListener('keydown', function(event) {
        if (overlay.style.display !== 'block') {
            lastKeyPressed = event.key.toLowerCase();
        }
    });
    
    setInterval(() => {
        if (!lastKeyPressed) {
            return;
        }
    
        const key = lastKeyPressed;
        lastKeyPressed = null;
    
        let letters = {
            'i': 'informatik',
            's': 'statistik',
            'p': 'PC',
            'o': 'OC',
            'b': 'bio',
            'a': 'bioanalytics',
            'n': 'nerd',
            'e': 'extra',
        };
        const pageId = letters[key];
    
        if (key >= '1' && key <= '9') {
            const currentPageId = window.location.hash.substring(1) || 'home';
            const currentPage = document.getElementById(currentPageId);
            const activeLinks = currentPage.querySelectorAll('.memes-container a');
    
            const index = parseInt(key, 10) - 1;
            const linkElement = activeLinks[index];
    
            if (linkElement) {
                const imgElement = linkElement.querySelector('.memes, .apps');
                handleLink(linkElement, imgElement);
            }
        } else if (key === 'h' || key === 'escape') {
            window.location.hash = 'home';
        } else if (pageId) {
            const currentPageId = window.location.hash.substring(1);
    
            if (currentPageId !== pageId) {
                if (animatablePages.includes(currentPageId) && animatablePages.includes(pageId)) {
                    lockUI();
                    window.location.hash = 'home';
                    isReversing = true;
    
                    resetImageStyles(() => {
                        setTimeout(() => {
                            startNewTransition(pageId);
                        }, 100);
                    });
                } else {
                    animateTransition(pageId, '#', document.querySelector(`a[data-page="${pageId}"] .memes, a[data-page="${pageId}"] .apps`));
                }
            }
        }
        navMenu.classList.remove('active');
        burgerMenu.classList.remove('active');
    }, 50);
});