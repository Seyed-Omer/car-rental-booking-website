// ==========================================
// Car Data (INR - Indian Rupees)
// Each car has originalPricePerDay and offerPricePerDay; booking uses offer price only.
// ==========================================
const cars = [
    {
        id: 1,
        name: "Tesla Model 3",
        originalPricePerDay: 9500,
        offerPricePerDay: 7500,
        seats: 5,
        fuel: "Electric",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
        category: "Electric"
    },
    {
        id: 2,
        name: "BMW 5 Series",
        originalPricePerDay: 12800,
        offerPricePerDay: 10200,
        seats: 5,
        fuel: "Petrol",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
        category: "Luxury"
    },
    {
        id: 3,
        name: "Mercedes C-Class",
        originalPricePerDay: 11800,
        offerPricePerDay: 9400,
        seats: 5,
        fuel: "Diesel",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
        category: "Luxury"
    },
    {
        id: 4,
        name: "Toyota Camry",
        originalPricePerDay: 7000,
        offerPricePerDay: 5500,
        seats: 5,
        fuel: "Hybrid",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
        category: "Sedan"
    },
    {
        id: 5,
        name: "Ford Mustang",
        originalPricePerDay: 16000,
        offerPricePerDay: 12800,
        seats: 4,
        fuel: "Petrol",
        transmission: "Manual",
        image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=400",
        category: "Sports"
    },
    {
        id: 6,
        name: "Jeep Wrangler",
        originalPricePerDay: 10200,
        offerPricePerDay: 8200,
        seats: 5,
        fuel: "Petrol",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400",
        category: "SUV"
    },
    {
        id: 7,
        name: "Audi A4",
        originalPricePerDay: 11200,
        offerPricePerDay: 8900,
        seats: 5,
        fuel: "Petrol",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
        category: "Luxury"
    },
    {
        id: 8,
        name: "Honda Civic",
        originalPricePerDay: 6000,
        offerPricePerDay: 4800,
        seats: 5,
        fuel: "Petrol",
        transmission: "Auto",
        image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400",
        category: "Sedan"
    }
];

// ==========================================
// DOM Elements
// ==========================================
const carsGrid = document.getElementById('carsGrid');
const bookingModal = document.getElementById('bookingModal');
const confirmationModal = document.getElementById('confirmationModal');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const selectedCarInfo = document.getElementById('selectedCarInfo');
const confirmationDetails = document.getElementById('confirmationDetails');
const closeConfirmation = document.getElementById('closeConfirmation');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const quickSearchForm = document.getElementById('quickSearchForm');
const contactForm = document.getElementById('contactForm');

// Price elements
const dailyRateEl = document.getElementById('dailyRate');
const numDaysEl = document.getElementById('numDays');
const totalPriceEl = document.getElementById('totalPrice');

// Date inputs
const pickupDateInput = document.getElementById('pickupDate');
const dropoffDateInput = document.getElementById('dropoffDate');

// State
let selectedCar = null;

// ==========================================
// FAQ Accordion Functionality
// ==========================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = '0';
                    q.nextElementSibling.style.padding = '0 0';
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.style.padding = '0 0';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '0 0 1.5rem 0';
            }
        });
    });
}

// ==========================================
// Deals Section - State & Functions
// ==========================================
let allDealsLoaded = false;
let displayedDealIds = new Set();

// ==========================================
// Fetch and Render Deals
// ==========================================
async function fetchDeals(showAll = false) {
    try {
        const url = showAll ? '/api/deals?all=true' : '/api/deals?limit=6';
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.providers && data.providers.length > 0) {
            renderDeals(data.providers, showAll);
            updateViewAllButton(data.hasMore && !showAll);
        }
    } catch (err) {
        console.error('Failed to load deals:', err);
        const dealsGrid = document.getElementById('dealsGrid');
        if (dealsGrid) {
            dealsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Unable to load deals. Please try again later.</p>';
        }
    }
}

function renderDeals(providers, isAppending = false) {
    const dealsGrid = document.getElementById('dealsGrid');
    if (!dealsGrid) return;

    // If not appending, clear existing deals
    if (!isAppending) {
        dealsGrid.innerHTML = '';
        displayedDealIds.clear();
    }

    providers.forEach(provider => {
        // Prevent duplicate cards
        if (displayedDealIds.has(provider.id)) {
            return;
        }

        displayedDealIds.add(provider.id);

        const dealCard = document.createElement('div');
        dealCard.className = 'deal-card';
        dealCard.dataset.providerId = provider.id;
        dealCard.style.opacity = '0';
        dealCard.style.transform = 'translateY(20px)';
        
        dealCard.innerHTML = `
            <div class="deal-header">
                <h3 class="deal-provider-name">${provider.name}</h3>
                <div class="deal-rating">
                    <span class="deal-rating-score">${provider.rating.toFixed(1)}</span>
                    <span class="deal-rating-text">${provider.ratingText}</span>
                </div>
            </div>
            <div class="deal-metrics">
                ${renderDealMetric('Car condition', provider.metrics.condition)}
                ${renderDealMetric('Cleanliness', provider.metrics.cleanliness)}
                ${renderDealMetric('Customer service', provider.metrics.service)}
                ${renderDealMetric('Easy pickup', provider.metrics.pickup)}
            </div>
            <div class="deal-footer">
                <div class="deal-price">
                    From <strong>${formatINR(provider.fromPricePerDay)}</strong> <span>per day</span>
                </div>
                <button class="btn btn-primary btn-deal-view" data-provider-id="${provider.id}">
                    View Deals
                </button>
            </div>
        `;

        dealsGrid.appendChild(dealCard);

        // Animate card appearance
        setTimeout(() => {
            dealCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            dealCard.style.opacity = '1';
            dealCard.style.transform = 'translateY(0)';
        }, 50);
    });
}

function renderDealMetric(label, value) {
    return `
        <div class="deal-metric">
            <div class="deal-metric-label">
                <span>${label}</span>
                <span class="deal-metric-value">${value}%</span>
            </div>
            <div class="deal-metric-bar">
                <div class="deal-metric-bar-fill" style="width: ${value}%;"></div>
            </div>
        </div>
    `;
}

function updateViewAllButton(hasMore) {
    const viewAllBtn = document.getElementById('viewAllDealsBtn');
    if (!viewAllBtn) return;

    if (hasMore && !allDealsLoaded) {
        viewAllBtn.textContent = 'View All Deals';
        viewAllBtn.style.display = 'inline-flex';
    } else {
        viewAllBtn.textContent = 'Show Less';
        viewAllBtn.style.display = 'inline-flex';
    }
}

function handleViewAllDeals() {
    const viewAllBtn = document.getElementById('viewAllDealsBtn');
    if (!viewAllBtn) return;

    if (allDealsLoaded) {
        // Show less - reload initial 6 deals
        allDealsLoaded = false;
        fetchDeals(false);
    } else {
        // Show all deals
        allDealsLoaded = true;
        fetchDeals(true);
    }
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderCars();
    setupEventListeners();
    setMinDates();
    initNavbarScroll();
    initFAQ();
    fetchDeals(false); // Load initial 6 deals
});

// ==========================================
// Format INR (Indian Rupees) with comma separator
// ==========================================
function formatINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

// ==========================================
// Render Cars (INR, original + offer price, discount badge)
// ==========================================
function renderCars() {
    carsGrid.innerHTML = '';
    
    cars.forEach(car => {
        const discountPercent = Math.round((1 - car.offerPricePerDay / car.originalPricePerDay) * 100);
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <div class="car-image">
                <img src="${car.image}" alt="${car.name}" loading="lazy">
                <span class="car-badge">${car.category}</span>
                ${discountPercent > 0 ? `<span class="car-discount-badge">${discountPercent}% OFF</span>` : ''}
            </div>
            <div class="car-content">
                <h3>${car.name}</h3>
                <div class="car-features">
                    <span class="car-feature">👥 ${car.seats} Seats</span>
                    <span class="car-feature">⛽ ${car.fuel}</span>
                    <span class="car-feature">⚙️ ${car.transmission}</span>
                </div>
                <div class="car-price">
                    <div class="price-wrap">
                        ${discountPercent > 0 ? `<span class="price-original">${formatINR(car.originalPricePerDay)}</span>` : ''}
                        <div class="price">${formatINR(car.offerPricePerDay)}<span>/day</span></div>
                    </div>
                    <button class="btn btn-primary btn-book" data-car-id="${car.id}">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
}

// ==========================================
// Event Listeners
// ==========================================
function setupEventListeners() {
    // Book buttons
    carsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-book')) {
            const carId = parseInt(e.target.dataset.carId);
            openBookingModal(carId);
        }
    });

    // Close modal
    modalClose.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    // Booking form
    bookingForm.addEventListener('submit', handleBookingSubmit);

    // Date change - calculate price
    pickupDateInput.addEventListener('change', calculatePrice);
    dropoffDateInput.addEventListener('change', calculatePrice);

    // Close confirmation
    closeConfirmation.addEventListener('click', closeConfirmationModal);
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            closeConfirmationModal();
        }
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Nav links - close mobile menu on click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Quick search form
    quickSearchForm.addEventListener('submit', handleQuickSearch);

    // Contact form
    contactForm.addEventListener('submit', handleContactSubmit);

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBookingModal();
            closeConfirmationModal();
        }
    });

    // Real-time validation
    setupFormValidation();

    // View All Deals button
    const viewAllBtn = document.getElementById('viewAllDealsBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', handleViewAllDeals);
    }

    // Deal "View Deals" buttons (for future car listing functionality)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-deal-view')) {
            const providerId = e.target.dataset.providerId;
            // Future: Open modal or navigate to car listing for this provider
            console.log('View deals for provider:', providerId);
        }
    });
}

// ==========================================
// Set Minimum Dates
// ==========================================
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    
    // Quick search dates
    const searchPickup = document.getElementById('searchPickup');
    const searchDropoff = document.getElementById('searchDropoff');
    
    if (searchPickup) searchPickup.min = today;
    if (searchDropoff) searchDropoff.min = today;
    
    // Booking modal dates
    if (pickupDateInput) pickupDateInput.min = today;
    if (dropoffDateInput) dropoffDateInput.min = today;

    // Update dropoff min when pickup changes
    if (searchPickup) {
        searchPickup.addEventListener('change', () => {
            searchDropoff.min = searchPickup.value;
            if (searchDropoff.value && searchDropoff.value < searchPickup.value) {
                searchDropoff.value = searchPickup.value;
            }
        });
    }

    pickupDateInput.addEventListener('change', () => {
        dropoffDateInput.min = pickupDateInput.value;
        if (dropoffDateInput.value && dropoffDateInput.value < pickupDateInput.value) {
            dropoffDateInput.value = '';
        }
    });
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==========================================
// Modal Functions
// ==========================================
function openBookingModal(carId) {
    selectedCar = cars.find(car => car.id === carId);
    
    if (!selectedCar) return;

    // Populate selected car info (INR, offer price only)
    selectedCarInfo.innerHTML = `
        <img src="${selectedCar.image}" alt="${selectedCar.name}">
        <div class="selected-car-info">
            <h4>${selectedCar.name}</h4>
            <p>${formatINR(selectedCar.offerPricePerDay)}/day</p>
        </div>
    `;

    // Reset form
    bookingForm.reset();
    clearErrors();
    
    // Set today as min date
    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.min = today;
    dropoffDateInput.min = today;

    // Copy dates from quick search if available
    const searchPickup = document.getElementById('searchPickup');
    const searchDropoff = document.getElementById('searchDropoff');
    
    if (searchPickup.value) pickupDateInput.value = searchPickup.value;
    if (searchDropoff.value) dropoffDateInput.value = searchDropoff.value;

    // Update price display (INR, offer price only)
    dailyRateEl.textContent = formatINR(selectedCar.offerPricePerDay);
    calculatePrice();

    // Show modal
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
    selectedCar = null;
}

function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// Price Calculation
// ==========================================
function calculatePrice() {
    if (!selectedCar) return;

    const pickupDate = pickupDateInput.value;
    const dropoffDate = dropoffDateInput.value;

    if (pickupDate && dropoffDate) {
        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const diffTime = dropoff - pickup;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const total = diffDays * selectedCar.offerPricePerDay;
            numDaysEl.textContent = diffDays;
            totalPriceEl.textContent = formatINR(total);
        } else {
            numDaysEl.textContent = '0';
            totalPriceEl.textContent = formatINR(0);
        }
    } else {
        numDaysEl.textContent = '0';
        totalPriceEl.textContent = formatINR(0);
    }
}

// ==========================================
// Form Validation
// ==========================================
function setupFormValidation() {
    const inputs = bookingForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const errorEl = document.getElementById(`${field.id}Error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';

    // Required check
    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Specific validations
    if (field.value.trim()) {
        switch (field.id) {
            case 'fullName':
                if (field.value.trim().length < 3) {
                    isValid = false;
                    errorMessage = 'Name must be at least 3 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'licenseNumber':
                if (field.value.trim().length < 5) {
                    isValid = false;
                    errorMessage = 'Please enter a valid license number';
                }
                break;

            case 'pickupDate':
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const pickup = new Date(field.value);
                if (pickup < today) {
                    isValid = false;
                    errorMessage = 'Pickup date cannot be in the past';
                }
                break;

            case 'dropoffDate':
                if (pickupDateInput.value) {
                    const pickupD = new Date(pickupDateInput.value);
                    const dropoffD = new Date(field.value);
                    if (dropoffD <= pickupD) {
                        isValid = false;
                        errorMessage = 'Drop-off date must be after pickup date';
                    }
                }
                break;
        }
    }

    if (!isValid) {
        field.classList.add('error');
        if (errorEl) errorEl.textContent = errorMessage;
    }

    return isValid;
}

function validateForm() {
    const inputs = bookingForm.querySelectorAll('input, select');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function clearErrors() {
    bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    bookingForm.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// ==========================================
// Handle Form Submissions
// ==========================================
function handleBookingSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Get form data
    const formData = {
        id: generateBookingId(),
        car: selectedCar,
        customer: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            license: document.getElementById('licenseNumber').value
        },
        rental: {
            pickupDate: pickupDateInput.value,
            dropoffDate: dropoffDateInput.value,
            pickupLocation: document.getElementById('pickupLocation').value,
            days: parseInt(numDaysEl.textContent, 10),
            totalPrice: parseInt(totalPriceEl.textContent.replace(/[₹,]/g, ''), 10)
        },
        bookedAt: new Date().toISOString()
    };

    // Save to localStorage
    saveBooking(formData);

    // Show confirmation
    showConfirmation(formData);

    // Close booking modal
    closeBookingModal();
}

function handleQuickSearch(e) {
    e.preventDefault();
    
    const pickup = document.getElementById('searchPickup').value;
    const dropoff = document.getElementById('searchDropoff').value;

    if (pickup && dropoff) {
        // Scroll to cars section
        document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Simple confirmation
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
}

// ==========================================
// LocalStorage Functions
// ==========================================
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('driveease_bookings', JSON.stringify(bookings));
}

function getBookings() {
    const bookings = localStorage.getItem('driveease_bookings');
    return bookings ? JSON.parse(bookings) : [];
}

function generateBookingId() {
    return 'BK' + Date.now().toString(36).toUpperCase();
}

// ==========================================
// Show Confirmation
// ==========================================
function showConfirmation(booking) {
    const locationNames = {
        'downtown': 'Downtown Office',
        'airport': 'Airport Terminal',
        'mall': 'City Mall',
        'station': 'Central Station'
    };

    confirmationDetails.innerHTML = `
        <p><span>Booking ID:</span> <strong>${booking.id}</strong></p>
        <p><span>Car:</span> <strong>${booking.car.name}</strong></p>
        <p><span>Customer:</span> <strong>${booking.customer.name}</strong></p>
        <p><span>Pickup Date:</span> <strong>${formatDate(booking.rental.pickupDate)}</strong></p>
        <p><span>Drop-off Date:</span> <strong>${formatDate(booking.rental.dropoffDate)}</strong></p>
        <p><span>Location:</span> <strong>${locationNames[booking.rental.pickupLocation]}</strong></p>
        <p><span>Duration:</span> <strong>${booking.rental.days} day(s)</strong></p>
        <p><span>Total Price:</span> <strong>${formatINR(booking.rental.totalPrice)}</strong></p>
    `;

    confirmationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==========================================
// Utility Functions
// ==========================================
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ==========================================
// Smooth Scroll for Navigation
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================
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

// Observe sections for fade-in animation
document.querySelectorAll('.feature-card, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
// ===============================
// Cars Render Logic
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const carsGrid = document.getElementById("carsGrid");

  if (!carsGrid) return;

  const cars = [
    {
      name: "Maruti Swift",
      type: "Petrol • Manual",
      price: 2500
    },
    {
      name: "Hyundai Creta",
      type: "Diesel • Manual",
      price: 4000
    },
    {
      name: "Toyota Innova",
      type: "Diesel • Automatic",
      price: 5500
    }
  ];

  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML = `
      <h3>${car.name}</h3>
      <p>${car.type}</p>
      <strong>₹${car.price} / day</strong>
      <br><br>
      <button class="btn btn-primary">Book Now</button>
    `;

    carsGrid.appendChild(card);
  });
});


