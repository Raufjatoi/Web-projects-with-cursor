document.addEventListener('DOMContentLoaded', function() {
    // Function to handle sidebar toggle
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapse');
    }

    // Add event listener to sidebar toggle button
    const sidebarToggleButton = document.querySelector('.sidebar-toggle');
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', toggleSidebar);
    }

    // Function to handle smooth scrolling to sections
    function smoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', smoothScroll);
    });
});
