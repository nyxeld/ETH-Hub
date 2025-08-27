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
    });

    // Corrected code to apply animation to all 'memes' images and center them
    const memesImages = document.querySelectorAll('.memes');

    memesImages.forEach(imageButton => {
        imageButton.addEventListener('click', (event) => {
            event.preventDefault();

            const link = event.target.closest('a');
            const pageId = link.dataset.page;
            const imgElement = imageButton;

            const rect = imgElement.getBoundingClientRect();
            const imageCenterX = rect.left + rect.width / 2;
            const imageCenterY = rect.top + rect.height / 2;

            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            const translateX = screenCenterX - imageCenterX;
            const translateY = screenCenterY - imageCenterY;

            imgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(4)`;
            imgElement.style.zIndex = '9999';
            imgElement.style.position = 'fixed';
            imgElement.style.left = `${rect.left}px`;
            imgElement.style.top = `${rect.top}px`;
            imgElement.style.margin = '0';

            setTimeout(() => {
                window.location.hash = pageId;

                imgElement.style.transform = '';
                imgElement.style.zIndex = '';
                imgElement.style.position = '';
                imgElement.style.left = '';
                imgElement.style.top = '';
                imgElement.style.margin = '';
                
            }, 400);
        });
    });
});
