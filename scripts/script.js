// Initialize bookings from localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const page = this.dataset.page;
            if (page === 'logout') {
                handleLogout();
            } else {
                const pageElement = document.getElementById(page + '-page');
                if (pageElement) {
                    pageElement.classList.add('active');
                }
                
                // Update bookings page if navigating to it
                if (page === 'bookings') {
                    displayBookings();
                }
            }
        });
    });
    
    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in').min = today;
    
    // Update check-out minimum when check-in changes
    document.getElementById('check-in').addEventListener('change', function() {
        const checkIn = this.value;
        document.getElementById('check-out').min = checkIn;
        calculateTotal();
    });
    
    // Calculate total when dates or room type changes
    document.getElementById('check-out').addEventListener('change', calculateTotal);
    document.getElementById('room-type').addEventListener('change', calculateTotal);
});

// Show booking form
function showBookingForm() {
    document.getElementById('booking-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close booking form
function closeBookingForm() {
    document.getElementById('booking-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('booking-form').reset();
    resetSummary();
}

// Calculate total price
function calculateTotal() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const roomTypeSelect = document.getElementById('room-type');
    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    
    if (checkIn && checkOut && selectedOption.dataset.price) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const pricePerNight = parseInt(selectedOption.dataset.price);
        
        if (nights > 0) {
            const total = nights * pricePerNight;
            document.getElementById('total-nights').textContent = nights;
            document.getElementById('price-per-night').textContent = '$' + pricePerNight;
            document.getElementById('total-amount').textContent = '$' + total;
        } else {
            resetSummary();
        }
    } else {
        resetSummary();
    }
}

// Reset summary
function resetSummary() {
    document.getElementById('total-nights').textContent = '0';
    document.getElementById('price-per-night').textContent = '$0';
    document.getElementById('total-amount').textContent = '$0';
}

// Submit booking
function submitBooking(event) {
    event.preventDefault();
    
    const guestName = document.getElementById('guest-name').value;
    const guestEmail = document.getElementById('guest-email').value;
    const guestPhone = document.getElementById('guest-phone').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const roomType = document.getElementById('room-type').options[document.getElementById('room-type').selectedIndex].text;
    const guests = document.getElementById('guests').value;
    const specialRequests = document.getElementById('special-requests').value;
    const totalAmount = document.getElementById('total-amount').textContent;
    const totalNights = document.getElementById('total-nights').textContent;
    
    // Create booking object
    const booking = {
        id: Date.now(),
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        roomType,
        guests,
        specialRequests,
        totalAmount,
        totalNights,
        status: 'Confirmed',
        bookingDate: new Date().toLocaleDateString()
    };
    
    // Save to bookings array and localStorage
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close booking modal
    closeBookingForm();
    
    // Show confirmation modal
    showConfirmation(booking);
}

// Show confirmation
function showConfirmation(booking) {
    const confirmModal = document.getElementById('confirmation-modal');
    document.getElementById('confirm-email').textContent = booking.guestEmail;
    
    // Build booking details
    const detailsHTML = `
        <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">#${booking.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Guest Name:</span>
            <span class="detail-value">${booking.guestName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Room Type:</span>
            <span class="detail-value">${booking.roomType}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Check-in:</span>
            <span class="detail-value">${new Date(booking.checkIn).toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Check-out:</span>
            <span class="detail-value">${new Date(booking.checkOut).toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Guests:</span>
            <span class="detail-value">${booking.guests}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Nights:</span>
            <span class="detail-value">${booking.totalNights}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value">${booking.totalAmount}</span>
        </div>
    `;
    
    document.getElementById('booking-details').innerHTML = detailsHTML;
    confirmModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close confirmation
function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Display bookings
function displayBookings() {
    const bookingsList = document.getElementById('bookings-list');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="empty-state">No bookings yet. Make your first reservation!</p>';
        return;
    }
    
    let bookingsHTML = '';
    bookings.forEach(booking => {
        bookingsHTML += `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>Booking #${booking.id}</h4>
                    <p><strong>${booking.roomType}</strong></p>
                    <p>Guest: ${booking.guestName}</p>
                    <p>Check-in: ${new Date(booking.checkIn).toLocaleDateString()} | Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</p>
                    <p>Guests: ${booking.guests} | Total: ${booking.totalAmount}</p>
                    <p>Booked on: ${booking.bookingDate}</p>
                </div>
                <div>
                    <span class="booking-status confirmed">${booking.status}</span>
                </div>
            </div>
        `;
    });
    
    bookingsList.innerHTML = bookingsHTML;
}

// Edit profile
function editProfile() {
    const name = prompt('Enter your name:', document.getElementById('profile-name').textContent);
    const email = prompt('Enter your email:', document.getElementById('profile-email').textContent);
    
    if (name) {
        document.getElementById('profile-name').textContent = name;
        localStorage.setItem('userName', name);
    }
    
    if (email) {
        document.getElementById('profile-email').textContent = email;
        localStorage.setItem('userEmail', email);
    }
}

// Load user profile
function loadProfile() {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedName) {
        document.getElementById('profile-name').textContent = savedName;
    }
    
    if (savedEmail) {
        document.getElementById('profile-email').textContent = savedEmail;
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data but keep bookings
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        alert('You have been logged out successfully!');
        
        // Redirect to home
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelector('[data-page="home"]').classList.add('active');
        document.getElementById('home-page').classList.add('active');
        
        // Reset profile
        document.getElementById('profile-name').textContent = 'Guest User';
        document.getElementById('profile-email').textContent = 'guest@example.com';
    }
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('booking-modal');
    const confirmModal = document.getElementById('confirmation-modal');
    
    if (event.target === bookingModal) {
        closeBookingForm();
    }
    
    if (event.target === confirmModal) {
        closeConfirmation();
    }
});