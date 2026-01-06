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
});
