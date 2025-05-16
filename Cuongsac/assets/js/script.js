// Handle mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Fix accessibility issue with search button
    const searchButton = document.querySelector('.search-bar button');
    searchButton.setAttribute('title', 'Tìm kiếm');
    searchButton.setAttribute('aria-label', 'Tìm kiếm');
    
    // Fix accessibility issue with mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('title', 'Menu');
        mobileMenuToggle.setAttribute('aria-label', 'Mở menu');
    }
    
    // Handle dropdown menu click
    const dropdownToggle = document.querySelector('.nav-item.dropdown .nav-link');
    const dropdownContainer = document.querySelector('.nav-item.dropdown');
    const navigation = document.querySelector('.navigation');

    // Add debugging console log
    console.log('Dropdown elements:', { dropdownToggle, dropdownContainer });
    
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dropdown clicked');
            
            // Toggle the dropdown menu
            dropdownContainer.classList.toggle('active');
        });
    }

    // Mobile menu toggle functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle navigation visibility
            if (navigation) {
                navigation.classList.toggle('mobile-active');
                
                // Prevent body scrolling when menu is open
                if (navigation.classList.contains('mobile-active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Close menu when clicking the X or outside the menu
    document.addEventListener('click', function(e) {
        // Close when clicking the X (overlay area outside the menu)
        if (navigation && navigation.classList.contains('mobile-active')) {
            // Check if the click was on the X button (the :before pseudo-element of navigation.mobile-active)
            // Since we can't directly access pseudo-elements, we need to check if the click was in the top-right corner of the overlay
            const navRect = navigation.getBoundingClientRect();
            const isClickOnCloseButton = (
                e.clientX > navRect.left + 15 && // 15px from right edge where X is located
                e.clientX < navRect.right - 15 && 
                e.clientY > navRect.top + 10 && // close to top where X is located
                e.clientY < navRect.top + 40 && // within about 30px of top
                !navigation.querySelector('.container').contains(e.target) && 
                !mobileMenuToggle.contains(e.target)
            );
            
            // Also check if clicked outside the navigation container
            const navContainer = navigation.querySelector('.container');
            const isClickOutsideNavContainer = !navContainer.contains(e.target) && !mobileMenuToggle.contains(e.target);
            
            if (isClickOnCloseButton || isClickOutsideNavContainer) {
                navigation.classList.remove('mobile-active');
                document.body.style.overflow = '';
                
                // Also close any open dropdowns
                if (dropdownContainer) {
                    dropdownContainer.classList.remove('active');
                }
            }
        }
    });

    // Handle responsive display
    function handleResponsiveDisplay() {
        const isMobile = window.innerWidth <= 768;
        const mobileHeader = document.querySelector('.mobile-nav-header');
        
        if (mobileHeader) {
            if (isMobile) {
                mobileHeader.style.display = 'flex';
                // Reset navigation classes on resize
                if (navigation) {
                    navigation.classList.remove('mobile-active');
                }
                if (dropdownContainer) {
                    dropdownContainer.classList.remove('active');
                }
            } else {
                mobileHeader.style.display = 'none';
            }
        }
    }

    // Initial call and window resize event
    handleResponsiveDisplay();
    window.addEventListener('resize', handleResponsiveDisplay);

    // Banner Slider Functionality
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to go to a specific slide
    function goToSlide(slideIndex) {
        // Normalize the index using modulo for circular sliding
        currentSlide = slideIndex % totalSlides;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        
        // Update the transform
        sliderContainer.style.transition = 'transform 0.5s ease';
        sliderContainer.style.transform = `translateX(-${currentSlide * 50}%)`;
        
        // Update indicator active state
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Pause the CSS animation when manually changing slides
        sliderContainer.style.animation = 'none';
    }
    
    // Previous slide button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    // Next slide button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Indicator buttons
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Reset animation when user stops interacting
    const bannerSlider = document.querySelector('.banner-slider');
    if (bannerSlider) {
        bannerSlider.addEventListener('mouseleave', () => {
            // Reset to CSS animation
            setTimeout(() => {
                sliderContainer.style.animation = 'slide 10s infinite';
                sliderContainer.style.transform = '';
            }, 500);
        });
    }
});

// Hàm hiển thị thông báo toast
function showToast(message) {
    console.log("Hiển thị thông báo toast:", message);
    
    // Tạo container cho toast nếu chưa có
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Tạo toast message
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Thêm toast vào container
    toastContainer.appendChild(toast);
    
    // Xử lý nút đóng
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slide-out 0.3s forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slide-out 0.3s forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Footer Dropdowns
document.addEventListener('DOMContentLoaded', function() {
    const footerDropdowns = document.querySelectorAll('.footer-dropdown');
    
    footerDropdowns.forEach(dropdown => {
        const title = dropdown.querySelector('h4');
        
        title.addEventListener('click', () => {
            // Close all other dropdowns
            footerDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.footer-dropdown')) {
        document.querySelectorAll('.footer-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}); 