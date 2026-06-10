// --- 1. DARK MODE FUNCTIONALITY ---
const themeToggleBtn = document.getElementById('theme-toggle');

// Check user configuration preference from localStorage if it exists
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
    // Determine target state
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = "light";
    
    if (theme !== "dark") {
        targetTheme = "dark";
    }
    
    // Apply dataset attribute to root <html> tag
    document.documentElement.setAttribute('data-theme', targetTheme);
    // Persist choice
    localStorage.setItem('theme', targetTheme);
});


// --- 2. INTERACTIVE CONTACT FORM ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page refresh sequence
    
    // Fetch input elements data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic structural visual validation feedback loop
    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status"; 

    // Simulate Server-side submission processing delay
    setTimeout(() => {
        if(name && email && message) {
            formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
            formStatus.className = "form-status success";
            
            // Clear input text metrics clear parameters
            contactForm.reset();
        } else {
            formStatus.textContent = "Oops! Please make sure all form elements are filled out correctly.";
            formStatus.className = "form-status error";
        }
    }, 1000);
});