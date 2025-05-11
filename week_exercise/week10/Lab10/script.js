// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to current navigation item
window.addEventListener('scroll', function() {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    sections.forEach(section => {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 60) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.getAttribute('id')}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Search functionality
const searchButton = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');

searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Here you can implement your search logic
        console.log('Searching for:', searchTerm);
        // For example, you could redirect to a search results page
        // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
});

// Add animation on scroll
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-card, .about-section');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll); 