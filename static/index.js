
function displayOldMessagesFromChosenChannel(channelName) {
    document.querySelector('#messages_list').innerHTML = null;
    document.querySelector('#deletion').innerHTML = null;

    // dislay old messages form storage
    const messages_list_element = document.querySelector('#messages_list');
    const deleteOptionsListElement =  document.querySelector('#deletion')

    const channelsObj3 = JSON.parse(localStorage.getItem('channels'));
    const default_channel = localStorage.getItem('default_channel')
    const currentChannelContent = channelsObj3[default_channel];
    
    if (!currentChannelContent) {
        return false
    } else {
        var currentChannelContentLength = currentChannelContent.length;
    }
    
    if (currentChannelContentLength > 100) {
        currentChannelContent.shift();
    }
    var counter2 = 0;
    for (const message_item of currentChannelContent) {
        // console.log({message_item,})
        const listElement = document.createElement('li');
        const deletionListElement = document.createElement('li');
        const a = document.createElement('a')
        a.href='#';
        a.id = `canDelete${counter2}`;
        counter2++;

        if (message_item.isDeleted == false) {
            const messageToDisplay = `${message_item.time} ${message_item.user}: ${message_item.message}`;
            listElement.appendChild(document.createTextNode(messageToDisplay));
        } else {
            const messageToDisplay = `${message_item.time} ${message_item.user}: This message was removed`;
            listElement.appendChild(document.createTextNode(messageToDisplay));
        }        
        messages_list_element.appendChild(listElement);
    
        //add delete option
        if (localStorage.getItem('username') == message_item.user) {
            a.appendChild(document.createTextNode('X'))
            deletionListElement.appendChild(a);
            deleteOptionsListElement.appendChild(deletionListElement);
        } else {
            a.appendChild(document.createTextNode(''))
            deletionListElement.appendChild(a);
            deleteOptionsListElement.appendChild(deletionListElement);
        }

        //delete message
        a.onclick = (evt) => {
            evt.preventDefault();
            message_item.isDeleted = true
            localStorage.setItem('channels', JSON.stringify(channelsObj3));
        }
    }  
};

//WORK WITH NAMES
// Set starting value of username to 'Stranger'
if (!localStorage.getItem('username'))
    localStorage.setItem('username', 'Stranger');

// Load current value of username
document.addEventListener('DOMContentLoaded', () => {
    //document.querySelector('#username').innerHTML = localStorage.getItem('username');

    // get new value for username from user
    document.querySelector('#new-name').onsubmit = () => {
        const username = document.querySelector('#name').value;
        localStorage.setItem('username', username);
    };
    // display welcome sentence
    document.querySelector('#welcome').innerHTML = "Your are logged in as " + localStorage.getItem('username');
});


//WORK WITH CHANNELS
if (!localStorage.getItem('channels'))
localStorage.setItem('channels', JSON.stringify({}))

// load current value of channels
document.addEventListener('DOMContentLoaded', () => {
    

const listContainer = document.querySelector('#channel-list');
const channelsObj = JSON.parse(localStorage.getItem('channels'));
const default_channel = localStorage.getItem('default_channel')
// console.log({default_channel,});

for (const channelName of Object.keys(channelsObj)) {
    const a = document.createElement('a');
    a.id = channelName;
    const listElement = document.createElement('li');
    a.appendChild(document.createTextNode(channelName));
    a.onclick = (evt) => {
        evt.preventDefault();
        localStorage.setItem('default_channel', channelName);
        displayOldMessagesFromChosenChannel(channelName);
    }
    a.href=""
    listElement.appendChild(a)
    listContainer.appendChild(listElement);
    
}                
 // get new channel from user
document.querySelector('#new_channel').onsubmit = (event) => {
    // event.preventDefault();

    // Create new item for list
    try {
        const new_channel_name = document.querySelector('#channel_name').value;
        var retrievedObject = localStorage.getItem('channels');
        const dict = JSON.parse(retrievedObject)
    
        dict[new_channel_name] = [];
                     
        // add list to local storage
        localStorage.setItem('channels', JSON.stringify(dict));
        
    } catch (e) {
        console.log(e);
    }
}

});


//WORK WITH MESSAGES
            
document.addEventListener('DOMContentLoaded', () => {
    const default_channel = localStorage.getItem('default_channel')
    displayOldMessagesFromChosenChannel(default_channel);
    
                
    if (!localStorage.getItem('default_channel'))
    localStorage.setItem('default_channel', JSON.stringify([]))
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //write new message
    socket.on('connect', () => {
        document.querySelector('#write_new_message').onsubmit= (event) => {
            event.preventDefault();
        
            // Create new item for list
            try {
                const timestap = Math.floor(Date.now() / 1000)
                const currentdate = new Date(); 
                const datetime = currentdate.getDate() + "/"
                                + (currentdate.getMonth()+1)  + "/" 
                                + currentdate.getFullYear() + " @ "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();

                const message = {};
                message.user = localStorage.getItem('username');
                message.time = datetime;
                message.message = document.querySelector('#new_message').value
                message.isDeleted = false;
                // console.log({message,});
                const default_channel = localStorage.getItem('default_channel')
                const channelsObj3 = JSON.parse(localStorage.getItem('channels'));
                const currentChannelContent = channelsObj3[default_channel];
            
                const currentChannelContentLength = currentChannelContent.length;
                // console.log({currentChannelContentLength})

                if (currentChannelContentLength > 100) {
                    currentChannelContent.shift();
                }

                currentChannelContent.push(message);


                socket.emit('submit message', {'message' : message});

                // add list to local storage

                localStorage.setItem('channels', JSON.stringify(channelsObj3));

                // Clear input field and disable button again
                document.querySelector('#new_message').value = '';
                return false;

            } catch (e) {
                console.log(e);
            }
        };
    });
    
    //display new messages
    socket.on('display message', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.message.time} ${data.message.user}: ${data.message.message}`;
        document.querySelector('#messages_list').append(li);
    });
});