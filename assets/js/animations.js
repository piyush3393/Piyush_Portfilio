/* ===============================
   RUN ALL FEATURES AFTER PAGE LOAD
================================ */
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initTypingEffect();
    initRevealAnimations();
    initCounters();
    initParallax();
    initCopyEmail();
    initNavigationHighlighter();
    initFormValidation();
    initContactForm();
    initSecurity();
});

/* ===============================
   MOBILE MENU
================================ */
function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const close = document.getElementById("menu-close");
    const menu = document.getElementById("mobile-menu");
    const links = document.querySelectorAll(".mobile-link");

    toggle?.addEventListener("click", () => {
        menu.classList.add("open");
        document.body.style.overflow = "hidden";
    });

    const closeMenu = () => {
        menu.classList.remove("open");
        document.body.style.overflow = "auto";
    };

    close?.addEventListener("click", closeMenu);
    links.forEach(link => link.addEventListener("click", closeMenu));
}

/* ===============================
   TYPING EFFECT
================================ */
function initTypingEffect() {
    const target = document.getElementById("typing-text");
    if (!target) return;

    const words = ["Full Stack Developer", "UI/UX Designer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const word = words[wordIndex];
        target.textContent = isDeleting
            ? word.substring(0, charIndex--)
            : word.substring(0, charIndex++);

        let speed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === word.length + 1) {
            isDeleting = true;
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ===============================
   REVEAL ON SCROLL
================================ */
function initRevealAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('[class*="reveal-"]').forEach(el => observer.observe(el));
}

/* ===============================
   COUNTER ANIMATION
================================ */
function initCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = entry.target;
            const end = parseInt(target.dataset.target);
            let current = 0;
            const step = end / 50;

            const timer = setInterval(() => {
                current += step;
                if (current >= end) {
                    target.textContent = end + "+";
                    clearInterval(timer);
                } else {
                    target.textContent = Math.floor(current) + "+";
                }
            }, 40);

            observer.unobserve(target);
        });
    }, { threshold: 1 });

    document.querySelectorAll(".counter").forEach(el => observer.observe(el));
}

/* ===============================
   PARALLAX EFFECT
================================ */
function initParallax() {
    const container = document.querySelector(".parallax-container");
    const element = document.querySelector(".parallax-element");
    if (!container || !element) return;

    container.addEventListener("mousemove", e => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        element.style.transform =
            `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });

    container.addEventListener("mouseleave", () => {
        element.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    });
}

/* ===============================
   COPY EMAIL
================================ */
function initCopyEmail() {
    const btn = document.getElementById("copy-email");
    const email = document.getElementById("email-text");

    btn?.addEventListener("click", () => {
        navigator.clipboard.writeText(email.textContent).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = "✓";
            setTimeout(() => btn.innerHTML = original, 2000);
        });
    });
}

/* ===============================
   NAVIGATION HIGHLIGHT
================================ */
function initNavigationHighlighter() {
    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 150) {
                current = section.id;
            }
        });

        links.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href").includes(current));
        });
    });
}

/* ===============================
   FORM VALIDATION UI
================================ */
function initFormValidation() {
    const form = document.getElementById("contact-form");

    form?.addEventListener("submit", e => {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add("was-validated");
    });
}

/* ===============================
   CONTACT FORM SUBMISSION
================================ */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const result = document.getElementById("form-result");
    if (!form) return;

    const accessKey = "ab8448d0-1f3b-41e0" + "-856b-488122c75f69";

    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.checkValidity()) return;

        const formData = new FormData(form);
        formData.append("access_key", accessKey);

        submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        result.classList.add("hidden");

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Submission failed");

            result.className = "success";
            result.textContent = "Message sent successfully!";
            form.reset();
            form.classList.remove("was-validated");

        } catch (err) {
            result.className = "error";
            result.textContent = err.message;
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = "Send";
            setTimeout(() => result.classList.add("hidden"), 5000);
        }
    });
}

/* ===============================
   BASIC SECURITY
================================ */
function initSecurity() {

    // Optional: Replace copied text with a custom message
    document.addEventListener("copy", (e) => {
        e.clipboardData.setData(
            "text/plain",
            "© 2026 Piyush Deo. Content copied from official website."
        );
        e.preventDefault();
    });


    console.log("%cHello Developer 👋", "color:#22c55e; font-size:24px; font-weight:bold;");



}