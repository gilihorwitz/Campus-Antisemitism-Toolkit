// Copy to clipboard functionality
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        if (button) {
            const feedback = button.nextElementSibling;
            if (feedback && feedback.classList.contains('copy-feedback')) {
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 2000);
            }
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    });
}

// Share functionality
function sharePage() {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    // Copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        // Fallback: show URL in prompt
        prompt('Copy this link:', url);
    });
}

function shareViaEmail() {
    const url = window.location.href;
    const title = document.title;
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`I thought you might find this helpful:\n\n${title}\n${url}`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Mobile menu functionality
let lastScrollTop = 0;
let scrollTimeout;

function handleScroll() {
    const nav = document.querySelector('.main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.main-nav ul');
    
    if (!nav || window.innerWidth > 768) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide menu when scrolling down, show when scrolling up
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
    
    // Close menu when scrolling
    if (menu && menu.classList.contains('active')) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            menu.classList.remove('active');
        }, 300);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.querySelector('.main-nav ul');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menu && window.innerWidth <= 768) {
        menu.classList.toggle('active');
        if (menuToggle) {
            menuToggle.classList.toggle('active');
        }
    }
}

// Close menu when clicking outside
function closeMenuOnClickOutside(event) {
    const menu = document.querySelector('.main-nav ul');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menu && menu.classList.contains('active')) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        }
    }
}

// Initialize copy buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking on a link (mobile)
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const menu = document.querySelector('.main-nav ul');
                if (menu) {
                    menu.classList.remove('active');
                }
                const toggle = document.querySelector('.menu-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll handler for mobile menu
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Click outside to close menu
    document.addEventListener('click', closeMenuOnClickOutside);
    
    // Find all copy buttons and attach event listeners
    const copyButtons = document.querySelectorAll('[data-copy-target]');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-copy-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const text = targetElement.textContent || targetElement.innerText;
                copyToClipboard(text, button);
            }
        });
    });

    // Find all share buttons
    const shareButtons = document.querySelectorAll('[data-share-action]');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-share-action');
            if (action === 'page') {
                sharePage();
            } else if (action === 'email') {
                shareViaEmail();
            }
        });
    });
});

