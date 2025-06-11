const KEY = 'pending-likes';

export function getStorage() {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
}

export function savePendingLikes(id) {
    const storage = getStorage();
    storage[id] = (storage[id] ?? 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(storage))
}

export function clearPendingLikes(id) {
    const storage = getStorage();
    delete storage[id];
    localStorage.setItem(KEY, JSON.stringify(storage))
}

export function clearStorage() {
    localStorage.removeItem(KEY);
}