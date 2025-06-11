import * as api from './api.js';
import * as storage from './storage.js';

async function refetchDisplays() {
    const displayList = document.querySelector('#display-list');
    displayList.innerHTML = '';
    try {
        const displays = await api.fetchDisplays();

        displays.forEach(display => {
            const element = createDisplayElement(display);

            displayList.appendChild(element);
        });
    } catch (e) {
        displayList.textContent = 'Cannot fetch displays list: ' + e.message;
    }
}

async function applyPendingLikes() {
    try {
        for (const [id, likesCount] of Object.entries(storage.getStorage())) {
            await api.addLikes(id, likesCount);
        }
        storage.clearStorage();
    } catch (e) {
        if (isFetchFailed(e)) {
            console.log('error while applying pending likes - we might be offline')
        } else {
            console.warn(e)
            alert('could not apply pending likes')
        }
    }
}

function createDisplayElement(display) {
    const root = document.createElement('li');

    const displayNameInput = document.createElement('label');
    displayNameInput.textContent = `${display.name} (${display.likes} likes)`;
    root.appendChild(displayNameInput)

    const showImageButton = document.createElement('button');
    showImageButton.textContent = 'Show image';
    showImageButton.addEventListener('click', () => {
        setDisplayImage(display.imageName)
    })
    root.appendChild(showImageButton);

    const addLikeButton = document.createElement('button');
    const pendingLikes = storage.getStorage()[display.id];
    addLikeButton.textContent = pendingLikes > 0 ? `Add like (${pendingLikes} pending)` : 'Add like';
    addLikeButton.addEventListener('click', async () => {
        addLikeButton.disabled = true;
        const pendingLikes = storage.getStorage()[display.id] ?? 0;
        try {
            await api.addLikes(display.id, pendingLikes + 1);
            await refetchDisplays();
            storage.clearPendingLikes();
        } catch (e) {
            if (isFetchFailed(e)) {
                storage.savePendingLikes(display.id);
                addLikeButton.disabled = false;

                addLikeButton.textContent = `Add like (${pendingLikes + 1} pending)`;
                return;
            }
            console.warn(e)
            alert('cannot update display')
        }
    })
    root.appendChild(addLikeButton);

    return root
}

function setDisplayImage(src) {
    const image = document.querySelector('#display-image');
    image.src = `/img/${src}`;
}

async function main() {
    await applyPendingLikes();
    await refetchDisplays();
}

// real-world usecase would use `navigator.onLine` - here we're running
// our server locally, so it's easier to just disable/enable the Node process 
function isFetchFailed(e) {
    return e.message === 'Failed to fetch';
}

main();
