document.addEventListener("DOMContentLoaded", function() {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800, // Animation duration in milliseconds
        once: true,    // Whether animation should happen only once
        offset: 50,    // Offset (in px) from the original trigger point
    });

    // =========================================================================
    // --- Cart Logic ---
    // =========================================================================
    const getCart = () => JSON.parse(localStorage.getItem('travelCart')) || [];
    const saveCart = (cart) => localStorage.setItem('travelCart', JSON.stringify(cart));

    const updateCartIcon = () => {
        const cart = getCart();
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            if (cart.length > 0) {
                cartCount.style.opacity = '1';
                cartCount.style.transform = 'scale(1)';
            } else {
                cartCount.style.opacity = '0';
                cartCount.style.transform = 'scale(0.5)';
            }
        }
    };

    const addToCart = (product) => {
        let cart = getCart();
        // Prevent duplicates
        if (!cart.find(item => item.id === product.id)) {
            cart.push(product);
            saveCart(cart);
            updateCartIcon();
            alert(`${product.name} has been added to your cart!`);
        } else {
            alert(`${product.name} is already in your cart.`);
        }
    };

    const renderCartItems = () => {
        const cart = getCart();
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return; // Only run on cart page

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            return;
        }

        let total = 0;
        cartContainer.innerHTML = cart.map(item => {
            total += parseFloat(item.price);
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>₹${item.price}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML += `
            <div class="cart-summary">
                <h3>Total: ₹${total.toFixed(2)}</h3>
                <a href="register.html" class="btn">Proceed to Checkout</a>
            </div>
        `;

        // Add event listeners for the new remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let cart = getCart();
                cart = cart.filter(item => item.id !== id);
                saveCart(cart);
                renderCartItems(); // Re-render the cart
                updateCartIcon();
            });
        });
    };

    // Add to cart button event listener (only on tours page)
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: e.target.dataset.price,
                image: e.target.dataset.image,
            };
            addToCart(product);
        });
    });

    // Initial setup on page load
    updateCartIcon();
    renderCartItems(); // This will only run on the cart page if the container exists

    // =========================================================================
    // --- Other Page Logic ---
    // =========================================================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        // Update aria-expanded attribute for accessibility
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute('aria-expanded', 'false');
    }));

    // --- Form Handling ---
    // We check if the form exists on the current page before adding an event listener.
    // This prevents errors on pages that don't have a specific form.

    // --- Auth Page (Login/Sign Up) Logic ---
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const signUpForm = document.getElementById('sign-up-form');
        const signInForm = document.getElementById('sign-in-form');

        signUpButton.addEventListener('click', () => {
            authContainer.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            authContainer.classList.remove("right-panel-active");
        });

        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd send data to a server
            alert('Sign up successful!');
            signUpForm.reset();
        });

        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd validate credentials
            alert('Sign in successful!');
            signInForm.reset();
        });
    }

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const nameInput = contactForm.querySelector("#name");
        const successMessage = contactForm.querySelector("#success-message");
        let successMessageTimeout;

        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            clearTimeout(successMessageTimeout);
            const name = nameInput.value;
            successMessage.textContent = `Thanks for reaching out, ${name}! We have received your message.`;
            successMessage.classList.add('show');
            contactForm.reset();
            successMessageTimeout = setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        });
    }

    // --- Search Bar Logic ---
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = searchContainer.querySelector('.search-input');

        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Stop the click from bubbling up to the document, which would instantly close the search box
            e.stopPropagation();
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Add a click listener to the document to close the search box when clicking outside
        document.addEventListener('click', (e) => {
            // Check if the search box is active and if the click was outside the container
            if (searchContainer.classList.contains('active') && !searchContainer.contains(e.target)) {
                searchContainer.classList.remove('active');
            }
        });
    }

    // --- Gallery Modal Logic ---
    // This logic should only run on the tours page.
    if (document.querySelector('.tours-container')) {
        const modal = document.getElementById("gallery-modal");
        const modalImg = document.getElementById("modal-image");
        const closeBtn = document.querySelector(".close-button");
        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");
        const galleryTriggers = document.querySelectorAll(".gallery-trigger");

        let currentImages = [];
        let currentIndex = 0;

        function showImage(index) {
            modalImg.src = currentImages[index];
        }

        galleryTriggers.forEach(trigger => {
            trigger.addEventListener("click", function(e) {
                // Only open modal if the click is not on the 'Book Now' button
                if (!e.target.classList.contains('btn')) {
                    const galleryData = this.dataset.gallery;
                    currentImages = galleryData.split(',');
                    currentIndex = 0;
                    showImage(currentIndex);
                    modal.classList.add('show');
                }
            });
        });

        closeBtn.addEventListener("click", function() {
            modal.classList.remove('show');
        });

        prevBtn.addEventListener("click", function() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
            showImage(currentIndex);
        });

        nextBtn.addEventListener("click", function() {
            currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        });

        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.classList.remove('show');
            }
        });
    }

    // --- Back Button Logic ---
    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }

    // --- Scroll Up Button Logic ---
    const scrollUpBtn = document.getElementById('scroll-up-btn');
    if (scrollUpBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollUpBtn.classList.add('show');
            } else {
                scrollUpBtn.classList.remove('show');
            }
        });

        scrollUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});