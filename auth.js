// Demo-only authentication script for DriveEase
// Validates email and shows a success message before redirecting.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');
    const emailInput = document.getElementById('authEmail');
    const emailError = document.getElementById('authEmailError');
    const messageEl = document.getElementById('authMessage');

    if (!form || !emailInput) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function clearFeedback() {
        emailError.textContent = '';
        emailInput.classList.remove('error');
        messageEl.textContent = '';
        messageEl.classList.remove('auth-message-success');
    }

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            clearFeedback();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFeedback();

        const value = emailInput.value.trim();

        if (!value) {
            emailError.textContent = 'Please enter your email address.';
            emailInput.classList.add('error');
            return;
        }

        if (!emailRegex.test(value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('error');
            return;
        }

        // Demo success message
        messageEl.textContent = 'Login successful (demo). Redirecting to home...';
        messageEl.classList.add('auth-message-success');

        // Redirect back to main site after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html#home';
        }, 2000);
    });
});

