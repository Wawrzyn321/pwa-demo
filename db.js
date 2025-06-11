const data = [
    {
        id: '1',
        name: 'yellow display',
        likes: 10,
        imageName: 'd1.jpg'
    },
    {
        id: '2',
        name: 'front display',
        likes: 20,
        imageName: 'd2.jpg'
    },
    {
        id: '3',
        name: 'display - will not be cached!',
        likes: 30,
        imageName: 'd3.jpg'
    },
    {
        id: '4',
        name: 'flat display',
        likes: 40,
        imageName: 'd4.jpg'
    },
];

function getDisplays() {
    return data;
}

function addLikes(id, likes = 1) {
    const display = data.find(d => d.id === id)
    display.likes += parseInt(likes);
    return id;
}

module.exports = {
    getDisplays,
    addLikes
}