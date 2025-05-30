// East Side Diner - Retro 50's Theme JavaScript
// Mobile navigation and menu loading functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting initialization...');
    
    // Load menu data from JSON
    loadMenuData();
    
    // Mobile navigation toggle
    initMobileNavigation();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add scroll effects
    initScrollEffects();
});

// Load menu data from JSON file
async function loadMenuData() {
    console.log('Loading menu data...');
    try {
        console.log('Fetching menu.json...');
        const response = await fetch('menu.json');
        console.log('Response received:', response.status);
        const menuData = await response.json();
        console.log('Menu data parsed:', menuData);
        renderMenu(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback to static menu if JSON fails
    }
}

// Render dynamic menu from JSON data
function renderMenu(menuData) {
    const menuContainer = document.querySelector('#menu .container');
    if (!menuContainer) return;

    // Update restaurant info in contact section
    updateContactInfo(menuData);

    // Clear existing menu content (keep the title)
    const menuTitle = menuContainer.querySelector('h2');
    menuContainer.innerHTML = '';
    if (menuTitle) {
        menuContainer.appendChild(menuTitle);
    } else {
        menuContainer.innerHTML = '<h2 class="neon-text">Our Groovy Menu</h2>';
    }

    // Create menu sections
    Object.entries(menuData.sections).forEach(([sectionName, items]) => {
        const sectionElement = createMenuSection(sectionName, items);
        menuContainer.appendChild(sectionElement);
    });
}

// Create a menu section element
function createMenuSection(sectionName, items) {
    const section = document.createElement('div');
    section.className = 'menu-section';
    
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = sectionName;
    section.appendChild(sectionTitle);
    
    const menuGrid = document.createElement('div');
    menuGrid.className = 'menu-grid';
    
    items.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
    
    section.appendChild(menuGrid);
    return section;
}

// Create a menu item element
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'menu-item-content';
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'menu-item-info';
    
    const title = document.createElement('h4');
    const titleText = document.createElement('span');
    titleText.className = 'title-text';
    titleText.textContent = item.name;
    title.appendChild(titleText);
    
    const description = document.createElement('p');
    description.textContent = item.description || '';
    
    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = `$${item.price.toFixed(2)}`;
    
    infoDiv.appendChild(title);
    if (item.description) {
        infoDiv.appendChild(description);
    }
    
    contentDiv.appendChild(infoDiv);
    contentDiv.appendChild(price);
    menuItem.appendChild(contentDiv);
    
    // Add options if available
    if (item.options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'menu-options';
        Object.entries(item.options).forEach(([option, optionPrice]) => {
            const optionElement = document.createElement('small');
            optionElement.textContent = `${option}: +$${optionPrice.toFixed(2)}`;
            optionsDiv.appendChild(optionElement);
        });
        infoDiv.appendChild(optionsDiv);
    }
    
    // Try to load an image for this menu item (will only add container if image exists)
    loadMenuItemImage(item.name, menuItem);
    
    return menuItem;
}

// Dynamic image loading for menu items
function loadMenuItemImage(itemName, menuItem) {
    // Convert item name to filename format
    const imageName = 'menu-' + itemName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-');         // Replace multiple hyphens with single
    
    const imageUrl = `images/${imageName}.jpg`;
    
    // Create image element for testing
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = itemName;
    img.className = 'menu-item-photo';
    
    // Handle successful image load
    img.onload = function() {
        // Image exists - add image to title row
        const titleElement = menuItem.querySelector('h4');
        if (titleElement) {
            titleElement.appendChild(img);
        }
        menuItem.classList.add('has-image');
    };
    
    // Handle image load error (file doesn't exist)
    img.onerror = function() {
        // Image doesn't exist - don't create container, just add class
        menuItem.classList.add('no-image');
    };
}

// Update contact information from menu data
function updateContactInfo(menuData) {
    // Update address in about section
    const aboutAddress = document.querySelector('.info-item p');
    if (aboutAddress && menuData.address) {
        aboutAddress.innerHTML = aboutAddress.innerHTML.replace(
            /136 East Main St<br>Welland, ON L3B 3W5/,
            menuData.address.replace(', ', '<br>')
        );
    }
    
    // Update phone in about section
    const aboutPhone = document.querySelectorAll('.info-item p');
    if (aboutPhone.length >= 3 && menuData.phone) {
        aboutPhone[2].textContent = menuData.phone;
    }
    
    // Update contact section
    const contactAddress = document.querySelector('.contact-details p');
    if (contactAddress && menuData.address) {
        contactAddress.innerHTML = contactAddress.innerHTML.replace(
            /136 East Main St, Welland, ON L3B 3W5/,
            menuData.address
        );
    }
    
    const contactPhone = document.querySelectorAll('.contact-details p')[1];
    if (contactPhone && menuData.phone) {
        contactPhone.innerHTML = contactPhone.innerHTML.replace(
            /\(905\) 735-4471/,
            menuData.phone
        );
    }
}

// Initialize mobile navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navLinks.classList.contains('active') 
                    ? `rotate(${index === 1 ? '0' : index === 0 ? '45' : '-45'}deg) ${index === 1 ? 'scale(0)' : 'translateY(0)'}`
                    : '';
            });
        });
        
        // Close menu when clicking on navigation links
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                });
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = hamburger.contains(event.target) || navLinks.contains(event.target);
            if (!isClickInsideNav && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                });
            }
        });
    }
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll effects
function initScrollEffects() {
    // Add scroll-based animations
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
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature, .menu-section, .about-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(255, 45, 45, 0.95), rgba(204, 30, 30, 0.95))';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-red), var(--secondary-red))';
            header.style.backdropFilter = 'none';
        }
    });
}

// Contact form handling
function handleContactForm() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message (in real app, you'd send to server)
            alert('Thank you for your message! We\'ll get back to you soon.');
            form.reset();
        });
    }
}

// Add some retro interactive effects
function addRetroEffects() {
    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    }
    
    // Add sparkle effect to buttons
    document.querySelectorAll('.btn, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const sparkle = document.createElement('span');
            sparkle.className = 'sparkle';
            sparkle.style.left = e.offsetX + 'px';
            sparkle.style.top = e.offsetY + 'px';
            this.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 600);
        });
    });
}

// Add glitch animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    .sparkle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        animation: sparkle 0.6s ease-out forwards;
    }
    
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg);
            opacity: 0;
        }
    }
    
    .menu-options {
        margin-top: 0.5rem;
    }
    
    .menu-options small {
        display: block;
        color: var(--primary-red);
        font-style: italic;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(style);

// Initialize retro effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addRetroEffects();
    handleContactForm();
});
    