// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .solution-item, .benefit-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Always prevent default to stay on page

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Por favor, insira um endereço de email válido.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // Submit to Formspree via AJAX
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success - show message and reset form
                showNotification('Obrigado pela sua mensagem! Entraremos em contato em breve.', 'success');
                this.reset();
            } else {
                // Error from Formspree
                throw new Error('Erro no envio');
            }
        } catch (error) {
            // Network error or other issues
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Format Brazilian phone number
        if (value.length >= 2) {
            if (value.startsWith('55')) {
                // International format
                value = value.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4}).*/, '+$1 ($2) $3-$4');
            } else if (value.length <= 11) {
                // National format
                if (value.length === 11) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length === 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
                }
            }
        }

        e.target.value = value;
    });

    // Allow only numbers, spaces, parentheses, hyphens, and plus sign
    phoneInput.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9\s\(\)\-\+]/.test(char)) {
            e.preventDefault();
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                      type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background: linear-gradient(180deg, #1a1a2e 0%, #0f172a 100%);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(139, 92, 246, 0.3);
            padding: 2rem 0;
            border-top: 1px solid rgba(139, 92, 246, 0.3);
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            margin: 1rem 0;
        }
    }
`;
document.head.appendChild(style);

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .benefit-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    });
}

// Trigger counter animation when benefits section is visible
const benefitsSection = document.querySelector('.benefits');
if (benefitsSection) {
    const benefitsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                benefitsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    benefitsObserver.observe(benefitsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation - otimizado para Core Web Vitals
window.addEventListener('load', () => {
    // Usar requestAnimationFrame para evitar blocking
    requestAnimationFrame(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    // Initialize automation graphic com delay para não bloquear carregamento
    setTimeout(() => {
        initializeAutomationGraphic();
    }, 100);
});

// Interactive automation graphic
function initializeAutomationGraphic() {
    const container = document.querySelector('.automation-container');
    const connections = document.querySelector('.connections');

    if (!container || !connections) return;

    // Create connection paths
    function createConnections() {
        const centralHub = container.querySelector('.central-hub');
        const nodes = container.querySelectorAll('.process-node');

        if (!centralHub || !nodes.length) return;

        const hubRect = centralHub.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const hubX = (hubRect.left + hubRect.width / 2) - containerRect.left;
        const hubY = (hubRect.top + hubRect.height / 2) - containerRect.top;

        nodes.forEach((node, index) => {
            const nodeRect = node.getBoundingClientRect();
            const nodeX = (nodeRect.left + nodeRect.width / 2) - containerRect.left;
            const nodeY = (nodeRect.top + nodeRect.height / 2) - containerRect.top;

            const line = connections.querySelector(`.line-${index + 1}`);
            if (line) {
                const path = `M ${nodeX} ${nodeY} Q ${(nodeX + hubX) / 2} ${(nodeY + hubY) / 2 - 30} ${hubX} ${hubY}`;
                line.setAttribute('d', path);
            }
        });
    }

    // Add hover effects to nodes
    const nodes = container.querySelectorAll('.process-node');
    nodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'scale(1.15)';
            node.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.4)';

            // Highlight corresponding connection
            const line = connections.querySelector(`.line-${index + 1}`);
            if (line) {
                line.style.strokeWidth = '3';
                line.style.filter = 'drop-shadow(0 0 8px #a855f7)';
            }
        });

        node.addEventListener('mouseleave', () => {
            node.style.transform = '';
            node.style.boxShadow = '';

            // Reset connection
            const line = connections.querySelector(`.line-${index + 1}`);
            if (line) {
                line.style.strokeWidth = '2';
                line.style.filter = '';
            }
        });

        // Add click effect
        node.addEventListener('click', () => {
            node.style.animation = 'none';
            node.offsetHeight; // Trigger reflow
            node.style.animation = `node-pulse 0.6s ease-out`;

            setTimeout(() => {
                node.style.animation = `node-float 4s ease-in-out infinite ${index}s`;
            }, 600);
        });
    });

    // Create connections after a small delay to ensure elements are positioned
    setTimeout(createConnections, 100);

    // Recreate connections on window resize
    window.addEventListener('resize', createConnections);
}

// Add node pulse animation
const nodeStyle = document.createElement('style');
nodeStyle.textContent = `
    @keyframes node-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(nodeStyle);