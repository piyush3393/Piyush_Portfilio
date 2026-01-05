document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTypingEffect();
    initRevealAnimations();
    initCounters();
    initParallax();
    initCopyEmail();
    initNavigationHighlighter();
});

function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const close = document.getElementById('menu-close');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    toggle?.addEventListener('click', () => {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        menu.classList.remove('open');
        document.body.style.overflow = 'auto';
    };

    close?.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));
}

function initTypingEffect() {
    const target = document.getElementById('typing-text');
    if (!target) return;
    const words = ["Full Stack Developer", "UI/UX Designer"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        target.textContent = isDeleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);
        
        let speed = isDeleting ? 50 : 150;
        if (!isDeleting && charIndex === currentWord.length + 1) { isDeleting = true; speed = 2000; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 500; }
        
        setTimeout(type, speed);
    }
    type();
}

function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('[class*="reveal-"]').forEach(el => observer.observe(el));
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const end = parseInt(target.getAttribute('data-target'));
                let current = 0, step = end / 50;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= end) { target.textContent = end + '+'; clearInterval(timer); }
                    else target.textContent = Math.floor(current) + '+';
                }, 40);
                observer.unobserve(target);
            }
        });
    }, { threshold: 1 });
    document.querySelectorAll('.counter').forEach(c => observer.observe(c));
}

function initParallax() {
    const container = document.querySelector('.parallax-container');
    const element = document.querySelector('.parallax-element');
    if (!container || !element) return;
    container.addEventListener('mousemove', (e) => {
        const { width, height, left, top } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5, y = (e.clientY - top) / height - 0.5;
        element.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    container.addEventListener('mouseleave', () => element.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)');
}

function initCopyEmail() {
    const btn = document.getElementById('copy-email');
    const email = document.getElementById('email-text');
    btn?.addEventListener('click', () => {
        navigator.clipboard.writeText(email.textContent).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined text-secondary">check</span>';
            setTimeout(() => btn.innerHTML = original, 2000);
        });
    });
}

function initNavigationHighlighter() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(s => { if (pageYOffset >= s.offsetTop - 150) current = s.getAttribute('id'); });
        navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href').includes(current)); });
    });
}

// Function to handle Form Validation UI
function initFormValidation() {
    const form = document.getElementById('contact-form');
    
    form?.addEventListener('submit', (e) => {
        // If the form is invalid (empty fields or wrong email), prevent sending
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Add the class that tells CSS to show the red borders
        form.classList.add('was-validated');
    }, false);
}


document.addEventListener('DOMContentLoaded', () => {
    
    initFormValidation();
});


function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const resultDiv = document.getElementById('form-result'); // Select the new div

    if (!form) return;

    // Security: Web3Forms Access Key (Split to hide from simple bots)
    const part1 = "ab8448d0-1f3b-41e0";
    const part2 = "-856b-488122c75f69";
    const accessKey = part1 + part2;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validate Form
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // 2. Prepare Data
        const formData = new FormData(form);
        formData.append("access_key", accessKey);

        // 3. UI Loading State
        const originalText = btnText.textContent;
        btnText.textContent = "Sending...";
        submitBtn.disabled = true;
        
        // Hide previous results if any
        resultDiv.classList.add('hidden');

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // --- SUCCESS STATE ---
                // Make the div Green
                resultDiv.className = "mt-4 p-4 rounded-xl text-center text-sm font-bold transition-all border border-green-500/20 bg-green-500/10 text-green-400 block";
                resultDiv.innerHTML = '<span class="flex items-center justify-center gap-2"><span class="material-symbols-outlined">check_circle</span> Message sent successfully!</span>';
                
                // Reset form
                form.reset();
                form.classList.remove('was-validated');
            } else {
                throw new Error(data.message || "Submission failed");
            }

        } catch (error) {
            // --- ERROR STATE ---
            // Make the div Red
            resultDiv.className = "mt-4 p-4 rounded-xl text-center text-sm font-bold transition-all border border-red-500/20 bg-red-500/10 text-red-400 block";
            resultDiv.innerHTML = '<span class="flex items-center justify-center gap-2"><span class="material-symbols-outlined">error</span> ' + error.message + '</span>';
        } finally {
            // Restore Button
            btnText.textContent = originalText;
            submitBtn.disabled = false;

            // Optional: Hide the message after 5 seconds
            setTimeout(() => {
                resultDiv.classList.add('hidden');
                resultDiv.classList.remove('block');
            }, 5000);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // ... your other init functions like initMobileMenu(), initTyping() etc.
    initContactForm(); 
});

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initTypingEffect();
    initRevealAnimations();
    initCounters();
    initParallax();
    initCopyEmail();
    initNavigationHighlighter();
    initContactForm();
    initSecurity(); // <--- ADD THIS LINE
});

// ... [Keep all your existing functions here] ...

// --- ADD THIS FUNCTION AT THE END ---
function initSecurity() {
    // 1. Disable Right Click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Optional: Alert the user
        // alert("Right-click is disabled to protect content."); 
    });

    // 2. Disable Keyboard Shortcuts (Ctrl+C, Ctrl+U, Ctrl+S, F12, Ctrl+Shift+I)
    document.addEventListener('keydown', (e) => {
        // Prevent F12 (Inspect Element)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Prevent Ctrl combinations
        if (e.ctrlKey && (
            e.key === 'u' || // View Source
            e.key === 'U' || 
            e.key === 'c' || // Copy
            e.key === 'C' || 
            e.key === 's' || // Save
            e.key === 'S' ||
            e.key === 'p' || // Print
            e.key === 'P'
        )) {
            e.preventDefault();
            return false;
        }

        // Prevent Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Clear Clipboard on Copy attempt (Fallback)
    document.addEventListener('copy', (e) => {
        e.clipboardData.setData('text/plain', 'Content is protected. © 2026 Piyush Deo.');
        e.preventDefault();
    });
    
    // 4. Console Warning for developers
    console.log("%cSTOP!", "color: red; font-size: 50px; font-weight: bold;");
    console.log("%cThis is a protected website. stealing code is prohibited.", "font-size: 20px;");
}