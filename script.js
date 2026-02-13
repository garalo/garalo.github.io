// Theme Toggle
const themeButtons = document.querySelectorAll('.theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    }
}

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

initTheme();

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenuBtn.click();
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA Button click handler
const ctaButton = document.querySelector('.hero .cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) {
            e.preventDefault();
            window.open(href, '_blank');
        }
    });
}

// Scroll animation for cards with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .blog-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Blog Search Functionality
const searchInput = document.getElementById('blog-search');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const cards = document.querySelectorAll('.blog-card');

        cards.forEach(card => {
            const title = card.querySelector('h2, h3')?.textContent.toLowerCase() || '';
            const text = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (title.includes(query) || text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = query ? 'none' : '';
            }
        });
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }

    lastScroll = currentScroll;
});

// Share functionality
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const card = btn.closest('.blog-card');
        const title = card.querySelector('h2 a')?.textContent || document.title;
        const url = card.querySelector('h2 a')?.href || window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                btn.classList.add('success');
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
                setTimeout(() => {
                    btn.classList.remove('success');
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
                }, 2000);
            } catch (err) {
                console.log('Copy failed');
            }
        }
    });
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        const btn = document.getElementById('newsletter-btn');
        const message = document.getElementById('newsletter-message');
        
        btn.disabled = true;
        btn.textContent = 'Gönderiliyor...';
        
        // Formspree entegrasyonu için (kullanacağınız form ID'si ile değiştirin)
        // const formspreeEndpoint = 'https://formspree.io/f/your-form-id';
        
        // Şimdilik localStorage'a kaydedelim
        try {
            let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            
            if (subscribers.includes(email)) {
                throw new Error('Bu e-posta zaten abone.');
            }
            
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
            message.textContent = 'Teşekkürler! Başarıyla abone oldunuz.';
            message.className = 'newsletter-message success';
            newsletterForm.reset();
            
            setTimeout(() => {
                message.className = 'newsletter-message';
            }, 5000);
            
        } catch (error) {
            message.textContent = error.message || 'Bir hata oluştu. Tekrar deneyin.';
            message.className = 'newsletter-message error';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Abone Ol';
        }
    });
}

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
