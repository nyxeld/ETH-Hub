document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.querySelector('.nav-links');
    const burgerMenu = document.getElementById('burger-menu');
    const pages = document.querySelectorAll('.page-content');
    const backgroundContainer = document.getElementById('background-container');
    const iframeContainer = document.querySelector('.iframe-container'); // Get the iframe container

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

    // Initial page load: Check the URL hash for a page ID
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

            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        });
    });

    // Handle hash changes for navigation and direct linking
    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.substring(1);
        showPage(pageId);
    });

    // ...
const imageButton = document.querySelector('.memes');

if (imageButton) {
    imageButton.addEventListener('click', (event) => {
        event.preventDefault();

        const link = event.target.closest('a');
        const pageId = link.dataset.page;
        
        imageButton.classList.add('zoom-out');

        // Listen for the end of the animation
        imageButton.addEventListener('animationend', () => {
            // After the animation ends, change the page and clean up
            window.location.hash = pageId;
            imageButton.classList.remove('zoom-out');
        }, { once: true }); // The '{ once: true }' option ensures the event listener is removed after it runs once
    });
}
});