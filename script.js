// script.js

// DOM Elements
const captchaOverlay = document.getElementById('captcha-overlay');
const captchaQuestion = document.getElementById('captcha-question');
const captchaAnswer = document.getElementById('captcha-answer');
const captchaSubmit = document.getElementById('captcha-submit');
const captchaError = document.getElementById('captcha-error');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeText = document.getElementById('welcome-text');
const enterSiteBtn = document.getElementById('enter-site');
const themeToggle = document.getElementById('theme-icon');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger-btn'); // Use the button ID
const navMenu = document.querySelector('.nav-links');
// const downloadButton = document.getElementById('download-cv'); // REMOVED

// Contact Modal Elements
const contactModal = document.getElementById('contact-modal');
const contactHeaderBtn = document.getElementById('contact-header-btn'); 
const closeBtn = document.querySelector('.close-btn');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const formSubmitBtn = document.getElementById('form-submit-btn');

// --- START: New variables for updated animations & state ---
let holdTimer = null;
let holdSuccessful = false;
const mainContent = [ document.querySelector('header'), document.querySelector('main'), document.querySelector('footer') ];
// --- END: New variables ---

// CAPTCHA Configuration
const captchaQuestions = [
    { question: "What is 3 + 4?", answer: "7" },
    { question: "How many sides does a square have?", answer: "4" },
    { question: "What is 3 x 3?", answer: "9" },
    { question: "How many sides does a triangle have?", answer: "3" },
    { question: "What is 10 - 5?", answer: "5" }
];

let currentCaptcha;

// Initialize the application
function init() {
    setupEventListeners();
    initTheme();
    injectNewStyles(); 
    prepareCaptchaButton();
    // --- START: Hide content from the very beginning ---
    mainContent.forEach(el => el.classList.add('content-hidden'));
    // --- END: Hide content ---
    showCaptcha();
}

// --- START: Updated CSS injection for content visibility ---
function injectNewStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* This class now makes the content completely invisible */
        .content-hidden {
            opacity: 0;
            visibility: hidden;
            filter: blur(5px);
            transform: scale(0.98);
            /* This transition will apply when the class is removed */
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        #captcha-submit {
            position: relative;
            overflow: hidden;
            transition: background-color 0.3s ease;
        }
        .hold-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0;
            background-color: rgba(255, 255, 255, 0.2);
            transition: width 1s linear;
        }
        #captcha-submit.holding .hold-progress {
            width: 100%;
        }
        #captcha-submit.verified {
            background: var(--accent-color);
        }
        #captcha-submit.verified::after {
            content: '✓';
            font-size: 1.2rem;
            margin-left: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}
// --- END: Updated CSS ---

function prepareCaptchaButton() {
    const progressSpan = document.createElement('span');
    progressSpan.className = 'hold-progress';
    captchaSubmit.appendChild(progressSpan);
}

// --- CAPTCHA & WELCOME SCREEN ---

function showCaptcha() {
    currentCaptcha = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
    captchaQuestion.textContent = currentCaptcha.question;
    captchaAnswer.value = '';
    captchaError.textContent = '';
    captchaOverlay.classList.add('active');
    captchaAnswer.focus();
}

function verifyCaptcha() {
    const userAnswer = captchaAnswer.value.trim().toLowerCase();
    const correctAnswer = currentCaptcha.answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        captchaOverlay.classList.remove('active');
        showWelcomeScreen();
    } else {
        captchaError.textContent = "Incorrect answer. Please try again.";
        captchaAnswer.value = '';
        captchaAnswer.focus();
        captchaAnswer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { captchaAnswer.style.animation = ''; }, 500);
    }
}

function showWelcomeScreen() {
    const portfolioName = "Joseph Salas";
    const fullText = `Welcome to the online portfolio of ${portfolioName}`;
    let charIndex = 0;
    
    welcomeScreen.classList.add('active');
    
    function typeWriter() {
        if (charIndex < fullText.length) {
            welcomeText.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                enterSiteBtn.style.display = 'block';
                enterSiteBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }, 500);
        }
    }
    typeWriter();
}

function enterSite() {
    welcomeScreen.style.transition = 'opacity 0.8s ease';
    welcomeScreen.style.opacity = '0';
    
    mainContent.forEach(el => el.classList.remove('content-hidden'));

    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 800);
}

// --- CORE FUNCTIONALITY ---
/* REMOVED downloadCV function */

function navigateToSection(sectionId) {
    if (!sectionId) return; // Prevent errors if sectionId is null

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
        }
    });
    
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        triggerAnimations(targetSection);
        // Optional: Scroll to the section if needed
        // targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
}

function openContactModal() {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    formMessage.textContent = '';
    contactForm.reset();
}

function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    if (!formData.get('name') || !formData.get('email') || !formData.get('description')) {
        formMessage.textContent = 'Please fill out all fields.';
        formMessage.style.color = 'var(--error-color)';
        return;
    }
    formSubmitBtn.textContent = 'Sending...';
    formSubmitBtn.disabled = true;
    formMessage.textContent = '';
    
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (response.ok) {
            formMessage.textContent = 'Message sent successfully!';
            formMessage.style.color = 'var(--accent-color)';
            contactForm.reset();
            setTimeout(closeContactModal, 2000);
        } else {
            formMessage.textContent = 'Oops! There was an issue. Please try again.';
            formMessage.style.color = 'var(--error-color)';
        }
    })
    .catch(() => {
        formMessage.textContent = 'A network error occurred.';
        formMessage.style.color = 'var(--error-color)';
    })
    .finally(() => {
        formSubmitBtn.textContent = 'Send Message';
        formSubmitBtn.disabled = false;
    });
}

// --- HOLD VERIFICATION FUNCTIONS ---
function startHoldVerification(e) {
    e.preventDefault();
    if (holdTimer !== null) return;
    
    if (captchaAnswer.value.trim() === '') {
        captchaError.textContent = "Please type the answer!";
        captchaAnswer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => { captchaAnswer.style.animation = ''; }, 500);
        return;
    }

    holdSuccessful = false;
    captchaError.textContent = '';
    captchaSubmit.classList.add('holding');
    
    holdTimer = setTimeout(() => {
        holdSuccessful = true;
        captchaSubmit.classList.remove('holding');
        captchaSubmit.classList.add('verified');
        captchaSubmit.textContent = 'Verified';

        setTimeout(() => {
            verifyCaptcha();
        }, 800);

        setTimeout(() => {
            captchaSubmit.classList.remove('verified');
            captchaSubmit.textContent = 'Verify';
        }, 1500);

    }, 1000);
}

function cancelHoldVerification() {
    clearTimeout(holdTimer);
    holdTimer = null;
    captchaSubmit.classList.remove('holding');
    
    if (!holdSuccessful && captchaAnswer.value.trim() !== '') {
        captchaError.textContent = "Press Enter or Hold the Mouse Button for 1 second.";
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    captchaSubmit.addEventListener('mousedown', startHoldVerification);
    captchaSubmit.addEventListener('mouseup', cancelHoldVerification);
    captchaSubmit.addEventListener('mouseleave', cancelHoldVerification);
    captchaSubmit.addEventListener('touchstart', startHoldVerification, { passive: true });
    captchaSubmit.addEventListener('touchend', cancelHoldVerification);

    captchaAnswer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            startHoldVerification(e);
        }
    });
    captchaAnswer.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            cancelHoldVerification();
        }
    });

    enterSiteBtn.addEventListener('click', enterSite);
    themeToggle.addEventListener('click', toggleTheme);
    
    // if (downloadButton) downloadButton.addEventListener('click', downloadCV); // REMOVED
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(link.getAttribute('data-target'));
        });
    });

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (contactHeaderBtn) contactHeaderBtn.addEventListener('click', openContactModal);
    if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
    if (contactModal) contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeContactModal();
    });
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
}
    
// --- ANIMATION, THEME & MOBILE MENU HELPERS ---
function resetAnimations(section) {
    section.querySelectorAll('.info-item, .timeline-item, .work-item, .highlight-item, .skill-category').forEach(item => item.classList.remove('visible'));
}

function triggerAnimations(section) {
    section.querySelectorAll('.info-item, .highlight-item, .timeline-item, .work-item, .skill-category').forEach((item, index) => {
        setTimeout(() => item.classList.add('visible'), index * 100);
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggle.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleMobileMenu() {
    const icon = document.getElementById('hamburger-icon');
    if (navMenu && hamburger && icon) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Change icon and prevent body scroll
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    }
}

function closeMobileMenu() {
    const icon = document.getElementById('hamburger-icon');
    if (navMenu && hamburger && icon) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', closeMobileMenu);
