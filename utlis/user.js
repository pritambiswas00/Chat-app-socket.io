const users = [];

//Join user chat

const userJoin = (id, username, room) => {
    const user = {id, username, room};

    users.push(user);
    return user;
}

//Get the current user

const getCurrentUser = (id) => {
   
     return users.find( user => user.id === id);
}

///users leaves chat 

const userLeaves = (id)=> {
    const index = users.findIndex( user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//get rooms users

const getRoomUser = (room) => {
    return users.filter( user => user.room === room)
}



module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUser
}