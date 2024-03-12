const users = [];

const userConnect = (socketId, userName) => {
    const user = { socketId, userName }
    users.push(user)
    return user
}

const userDisconnect = (socketId) => {
    const index = users.findIndex(user => user.socketId === socketId)

    if(index === -1) {
        console.log('hittade inte användaren');
        return
    }

    return users.splice(index, 1)[0];
}

module.exports = {
    userConnect,
    userDisconnect
}