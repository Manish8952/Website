// --- 1. THEME TOGGLE (saved choice is applied early in <head>) ---
const root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// --- 2. CONTACT FORM ---
// NOTE: this only simulates sending. To receive real messages, point the form
// at a service such as Formspree (action="https://formspree.io/f/YOUR_ID").
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();

    status.className = 'form-status';
    status.textContent = 'Sending message...';

    setTimeout(() => {
        status.textContent = `Thank you, ${name}! Your message has been sent.`;
        status.className = 'form-status success';
        form.reset();
    }, 800);
});
