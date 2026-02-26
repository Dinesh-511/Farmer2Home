const socket = io('https://farmer2home-1.onrender.com');

socket.on('connect', () => {

    // If we have a saved userId (active session), re-join the room
    if (window.currentUserId) {
        socketService.joinUserRoom(window.currentUserId);
    }
});

socket.on('disconnect', () => {

});

const socketService = {
    on: (event, callback) => {
        socket.on(event, callback);
    },
    emit: (event, data) => {
        socket.emit(event, data);
    },
    joinFarmerRoom: (farmerId) => {
        if (!farmerId) return;
        window.currentFarmerRoomId = farmerId;

        socket.emit('joinFarmerRoom', farmerId);
    },
    joinUserRoom: (userId) => {
        if (!userId) return;

        socket.emit('joinUserRoom', userId);
    }
};

window.socketService = socketService;
export default socketService;
