// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function getChannelsFromStorage() {
    const channelsObj = JSON.parse(localStorage.getItem('channels'));
    return channelsObj;
}

function checkLength(currentChannelContent) {
    if (!currentChannelContent) {
        return JSON.stringify({});
        
    } else {
        const currentChannelContentLength = currentChannelContent.length;
        if (currentChannelContentLength > 100) {
            currentChannelContent.shift();
        }
    }
    return currentChannelContent
}

function updateLocalStorage(channelName, content) {
    localStorage.setItem(channelName, content);
}

function getDefaultChannel() {
    const defaultChannel = localStorage.getItem('defaultChannel');
    return defaultChannel;
}

function createNewRow() {
    const tableRow = document.createElement('div');
    tableRow.classList.add("row");
    return tableRow;
}
function createNewColumn() {
    const tableColumn = document.createElement('div');
    tableColumn.classList.add("col");
    return tableColumn
}

function createNewAElement() {
    const a = document.createElement('a');
    a.href='';
    return a;
}

function deleteOption() {
    const deleteButton = createNewColumn();
    deleteButton.classList.remove('col')
    deleteButton.classList.add('col-2');
    deleteButton.id = 'deleteButton'
    const a = createNewAElement();
    a.appendChild(document.createTextNode('Delete'))
    deleteButton.appendChild(a);
    return deleteButton;
};

function displayNewMessage(data) {
    const tableRow = createNewRow();
    const tableColumn = createNewColumn();
    const deleteButton = deleteOption();
    tableColumn.id = data.id
    console.log({data})

    const messageToDisplay = `${data["time"]} ${data["user"]}: ${data["message"]}`;
    tableColumn.appendChild(document.createTextNode(messageToDisplay));
    tableRow.appendChild(tableColumn);
    tableRow.appendChild(deleteButton);
    // if (socket.username == data["user"]) { 
    //     tableRow.appendChild(deleteButton);
    // }

    document.querySelector('#messages_list').append(tableRow);

    deleteButton.onclick = (evt) => {
        event.preventDefault();
        // console.log({data})
        // deleteMessage(data);
        socket.emit('delete message', {'message' : data});
        socket.on('display deleted message', data => {
            // const deletedMessageText = data["message"]["message"];
            // const deletedMessageID = data["message"]["id"];
            // // console.log({deletedMessageID});
            // const deletedMessageTime = data["message"]["time"];
            // const deletedMessageUser = data["message"]["user"];
            document.getElementById(`${data["message"]["id"]}`).innerHTML = `${data["message"]["time"]} ${data["message"]["user"]}: ${data["message"]["message"]}`;
        });
    }
};

function deleteMessage(message_item) {

    socket.emit('delete message', {'message' : message_item});
    socket.on('display deleted message', data => {
        const deletedMessageText = data["message"]["message"];
        const deletedMessageID = data["message"]["id"];
        // console.log({deletedMessageID});
        const deletedMessageTime = data["message"]["time"];
        const deletedMessageUser = data["message"]["user"];
        document.getElementById(`${deletedMessageID}`).innerHTML = `${deletedMessageTime} ${deletedMessageUser}: ${deletedMessageText}`;

    });
};


function displayOldMessagesFromChosenChannel(channelName) {
    // empty messages from previous list
    document.querySelector('#messages_list').innerHTML = null;

    // show current channel title
    document.querySelector('#currentChannelName').innerHTML = `Messages in channel: ${channelName}`;

    // dislay old messages form storage
    const channelsObj = getChannelsFromStorage();
    const defaultChannel = getDefaultChannel();
    const currentChannelContent = channelsObj[defaultChannel];
    const currentChannelContentChecked = checkLength(currentChannelContent);
    
    
    for (const message_item of currentChannelContentChecked) {
        
        const tableRow = createNewRow();
        const tableColumn = createNewColumn();
        const deleteButton = deleteOption();
        tableColumn.id = message_item.id

        // check if message was deleted previoulsy
        if (message_item.isDeleted == false) {
                const messageToDisplay = `${message_item.time} ${message_item.user}: ${message_item.message}`;
                tableColumn.appendChild(document.createTextNode(messageToDisplay));
                tableRow.appendChild(tableColumn);
                tableRow.appendChild(deleteButton);
                // if (socket.username == message_item.user) {
                //     tableRow.appendChild(deleteButton);
                // }
        } else {
            const messageToDisplay = `${message_item.time} ${message_item.user}: This message was removed`;
            tableColumn.appendChild(document.createTextNode(messageToDisplay));
            tableRow.appendChild(tableColumn);
        }
        document.querySelector('#messages_list').append(tableRow);
    
        // delete message
        deleteButton.onclick = (evt) => {
            evt.preventDefault();
            if (socket.username == message_item.user) {
                // deleteMessage(message_item);
                socket.emit('delete message', {'message' : message_item});
                socket.on('display deleted message', data => {
                    const deletedMessageText = data["message"]["message"];
                    const deletedMessageID = data["message"]["id"];
                    // console.log({deletedMessageID});
                    const deletedMessageTime = data["message"]["time"];
                    const deletedMessageUser = data["message"]["user"];
                    document.getElementById(`${deletedMessageID}`).innerHTML = `${deletedMessageTime} ${deletedMessageUser}: ${deletedMessageText}`;

    });
                message_item.isDeleted = true
            }
            updateLocalStorage('channels', JSON.stringify(channelsObj));
        }
        
    }; 
};

//WORK WITH NAMES
// Set starting value of username to 'Stranger'
// if (!localStorage.getItem('username'))
//     updateLocalStorage('username', 'Stranger');
//     const defaultUsername = 'Stranger'

// Load current value of username
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#welcome').innerHTML = 'Hi, Stranger';

    // get new value for username from user
    document.querySelector('#newUser').onsubmit = (event) => {
         event.preventDefault();

        const username = document.querySelector('#name').value;
        socket.username = username;
        // display welcome sentence
        document.querySelector('#welcome').innerHTML = "Hi,  " + socket.username;
        document.querySelector('#addinguser').classList.add("addingUser"); 

        document.querySelector('#flack').classList.remove('hideContent')
        document.querySelector('#flack').classList.add('showContent')

        // document.getElementsByClassName('hideContent').id = 'body';

        // document.getElementsByClassName('hideContent').classList.remove('hideContent');
        // document.getElementById('#flack').classList.add('showContent');

    };
    
});


    



//WORK WITH CHANNELS
if (!localStorage.getItem('channels'))
updateLocalStorage('channels', JSON.stringify({}));

// load current value of channels
document.addEventListener('DOMContentLoaded', () => {

    const listContainer = document.querySelector('#channel-list');
    const channelsObj = getChannelsFromStorage();
    const defaultChannel = getDefaultChannel()

    for (const channelName of Object.keys(channelsObj)) {
        const a = createNewAElement();
        const tableRow = createNewRow();
        const tableColumn = createNewColumn();
        a.id = channelName;
        a.appendChild(document.createTextNode(channelName));
        a.onclick = (evt) => {
            evt.preventDefault();
            updateLocalStorage('defaultChannel', channelName);
            displayOldMessagesFromChosenChannel(channelName);
        }
        tableColumn.appendChild(a);
        tableRow.appendChild(tableColumn);
        listContainer.appendChild(tableRow);    
    }                
    // get new channel from user
    document.querySelector('#new_channel').onsubmit = (event) => {
        // event.preventDefault();

        // Create new item for list
        try {
            const new_channel_name = document.querySelector('#channel_name').value;
            const channelsObj = getChannelsFromStorage();

            // check if there is no channel already
            for (const channelName of Object.keys(channelsObj)) {
                if (channelName == new_channel_name) {
                    alert(`There is already a channel named ${new_channel_name}`)
                    return false;
                }
            }
            channelsObj[new_channel_name] = [];     
            // add list to local storage
            updateLocalStorage('channels', JSON.stringify(channelsObj))
            
        } catch (e) {
            console.log(e);
        }
    }
});


//WORK WITH MESSAGES
            
document.addEventListener('DOMContentLoaded', () => {
    const defaultChannel = getDefaultChannel()
    displayOldMessagesFromChosenChannel(defaultChannel);
                
    if (!localStorage.getItem('defaultChannel'))
    updateLocalStorage('defaultChannel', JSON.stringify([]));
    
    //write new message
    socket.on('connect', () => {
        document.querySelector('#write_new_message').onsubmit= (event) => {
            event.preventDefault();
        
            // Create new item for list
            try {
                const currentdate = new Date(); 
                const datetime = currentdate.getDate() + "/"
                                + (currentdate.getMonth()+1)  + "/" 
                                + currentdate.getFullYear() + " @ "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();

                const message = {};
                message.user = socket.username 
                
                // message.user = localStorage.getItem('username');
                message.time = datetime;
                message.message = document.querySelector('#new_message').value
                message.isDeleted = false;
                message.id = new Date().getTime() + message.user;
                const defaultChannel = getDefaultChannel();
                const channelsObj = getChannelsFromStorage();
                const currentChannelContent = channelsObj[defaultChannel];
                const currentChannelContentChecked = checkLength(currentChannelContent);
            
                currentChannelContentChecked.push(message);
                // console.log({message})

                socket.emit('submit message', {'message' : message});

                // add list to local storage
                updateLocalStorage('channels', JSON.stringify(channelsObj));

                // Clear input field and disable button again
                document.querySelector('#new_message').value = '';
                return false;

            } catch (e) {
                console.log(e);
            }
        };
    });
    
    //display new message
    socket.on('display message', data => {
        const dataToBeDisplayed = data["message"]
        // console.log({dataToBeDisplayed})
        displayNewMessage(dataToBeDisplayed);
    });
});


