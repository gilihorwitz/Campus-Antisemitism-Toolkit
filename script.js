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

// Initialize copy buttons on page load
document.addEventListener('DOMContentLoaded', () => {
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

