// Script.js
document.addEventListener('DOMContentLoaded', function() {

    // Hero role terminal rotator
    const roleText = document.getElementById('role-text');
    const roles = ['Freelancer', 'YouTuber', 'Canva Designer', 'Content Writer', 'Digital Creator'];
    let roleIndex = 0;

    if (roleText) {
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleText.style.opacity = '0';
            setTimeout(() => {
                roleText.textContent = roles[roleIndex];
                roleText.style.opacity = '1';
            }, 200);
        }, 2200);
        roleText.style.transition = 'opacity 0.2s ease';
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // Active navigation highlight on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // offset for fixed navbar
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // FAQ accordion functionality (click to toggle)
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        // Add plus/minus icon if not already present
        if (!question.querySelector('i')) {
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-chevron-down');
            question.appendChild(icon);
        }

        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            if (!answer || !icon) return;

            // Toggle current answer
            const isOpen = answer.classList.contains('show');
            
            // First close all others
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('show');
                const prevIcon = item.previousElementSibling.querySelector('i');
                if (prevIcon) prevIcon.style.transform = 'rotate(0deg)';
            });

            // Then open the clicked one if it wasn't already open
            if (!isOpen) {
                answer.classList.add('show');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Form submission handling - Chat/Support form
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(chatForm);
            const message = formData.get('message').trim();

            if (!message) return;

            // Display user's message
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user-message');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Clear input
            chatForm.reset();

            // Send to Formspree
            try {
                const response = await fetch(chatForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Optional: add confirmation message
                    const confirmMsg = document.createElement('div');
                    confirmMsg.classList.add('message', 'system-message');
                    confirmMsg.textContent = 'Message sent and subscription confirmed!';
                    chatMessages.appendChild(confirmMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            } catch (error) {
                console.error('Error sending chat message:', error);
            }
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Thank you! Your message has been sent and you are now subscribed.');
                    contactForm.reset();
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            } catch (error) {
                alert('Error sending message. Please check your connection and try again.');
                console.error('Contact form error:', error);
            }
        });
    }

    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // adjust for fixed navbar height
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // Social media hover effects
    document.querySelectorAll('.social-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Staggered animation on load for social icons
    document.querySelectorAll('.social-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
});












// --- ADVANCED FULL-TEXT SEARCH LOGIC ---
const searchInput = document.getElementById('site-search');
const searchResults = document.getElementById('search-results');

// 1. Create an empty array to hold all the website's text
let siteContentIndex = [];

// 2. Function to scan the whole website and build the index
function buildSearchIndex() {
    siteContentIndex = []; // Reset the index
    
    // Find all sections on the page
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        // Find all text elements inside this section (headings, paragraphs, lists)
        const textElements = section.querySelectorAll('h1, h2, h3, p, li, span');
        
        textElements.forEach(el => {
            const text = el.innerText.trim();
            // Only save text that has actual words (longer than 5 characters)
            if (text.length > 5) {
                siteContentIndex.push({
                    element: el,          // Save the actual HTML element
                    text: text            // Save the text to search through
                });
            }
        });
    });
}

// Run the scanner right when the page loads
window.addEventListener('load', buildSearchIndex);

// 3. The Search Engine Logic
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        searchResults.innerHTML = ''; 
        
        if (query.length > 1) { // Start searching after 2 letters
            // Find matching text anywhere on the site
            const matches = siteContentIndex.filter(item => 
                item.text.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                searchResults.style.display = 'block';
                
                // Show up to 8 results max so the dropdown doesn't get too long
                matches.slice(0, 8).forEach(match => {
                    const li = document.createElement('li');
                    
                    // Create a short "snippet" of the text showing the match
                    const matchIndex = match.text.toLowerCase().indexOf(query);
                    const start = Math.max(0, matchIndex - 15);
                    const end = Math.min(match.text.length, matchIndex + query.length + 15);
                    let snippet = match.text.substring(start, end);
                    
                    // Bold and color the matching word in the dropdown
                    const regex = new RegExp(query, "gi");
                    snippet = snippet.replace(regex, matchedWord => `<strong style="color: var(--secondary-color);">${matchedWord}</strong>`);
                    
                    li.innerHTML = `...${snippet}...`;
                    
                    // When clicked, scroll right to that exact text!
                    li.onclick = () => {
                        // Smooth scroll to the exact element
                        match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Highlight the element on the screen briefly so the user sees it
                        const originalBg = match.element.style.backgroundColor;
                        match.element.style.transition = 'background-color 0.5s';
                        match.element.style.backgroundColor = '#fff3cd'; // Light yellow highlight
                        
                        setTimeout(() => {
                            match.element.style.backgroundColor = originalBg; // Remove highlight after 2 seconds
                        }, 2000);

                        searchResults.style.display = 'none'; 
                        searchInput.value = ''; 
                    };
                    searchResults.appendChild(li);
                });
            } else {
                searchResults.style.display = 'block';
                searchResults.innerHTML = '<li style="color: #999; padding: 10px;">No results found...</li>';
            }
        } else {
            searchResults.style.display = 'none'; 
        }
    });

    // Hide dropdown if clicked outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}
