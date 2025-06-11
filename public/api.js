export async function fetchDisplays() {
    return fetch('/displays').then(body => body.json());
}

export async function addLikes(id, count = 1) {
    return fetch(`/displays/${id}?count=${count}`, {method: 'POST'});
}
