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
            if (e.message === 'Failed to fetch') {
                storage.savePendingLikes(display.id);
                addLikeButton.disabled = false;

                addLikeButton.textContent = `Add like (${pendingLikes + 1} pending)`;
                return;
            }
            console.log(e)
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
    try {
        for (const [id, likesCount] of Object.entries(storage.getStorage())) {
            await api.addLikes(id, likesCount);
        }
        storage.clearStorage();
    } catch (e) {
        if (e.message === 'Failed to fetch') {
            console.log('offline, thats ok')
        } else {
            console.log(e)
            alert('could not')
        }
    }
    await refetchDisplays();
}


main();
