const registerButton = document.querySelector('#register');

// check feature availability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(onRegistrations);
} else {
    registerButton.disabled = true;
    registerButton.textContent = 'Service workers are not supported';
}

function onRegistrations(registrations) {
    let registered = !!registrations.length;

    if (registered) {
        console.log('Already registed! All registrations:', registrations);
        registerButton.textContent = 'Unregister service worker';
    } else {
        registerButton.textContent = 'Register service worker';
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
}