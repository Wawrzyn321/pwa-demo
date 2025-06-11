const registerButton = document.querySelector('#register');
let registered;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registered = !!registrations.length;
        if (registered) {
            console.log('Registed! All registrations:', registrations);
            registerButton.textContent = 'Unregister service worker'
        } else {
            registerButton.textContent = 'Register service worker'
        }
    });
} else {
    registerButton.disabled = true;
    registerButton.textContent = 'Service workers are not supported';
}


registerButton.addEventListener('click', async () => {
    if (registered) {
        const registration = await navigator.serviceWorker.getRegistration();
        registration.unregister();
        registerButton.textContent = 'Register service worker'
    } else {
        navigator.serviceWorker.register("/service-worker.js");
        registerButton.textContent = 'Unregister service worker'
    }
    registered = !registered;
})
