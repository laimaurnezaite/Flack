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
localStorage.setItem('channels', JSON.stringify([]))

// load current value of channels
document.addEventListener('DOMContentLoaded', () => {

const list_element = document.querySelector('#channel-list');
const list_from_storage = localStorage.getItem('channels');
const list_to_show = JSON.parse(list_from_storage);

for (const item of list_to_show) {
    const item2 = document.createElement('li');
    item2.appendChild(document.createTextNode(item));
    list_element.appendChild(item2);
}
                
 // get new channel from user
document.querySelector('#new_channel').onsubmit = (event) => {
    //event.preventDefault();
    // Create new item for list
    try {
        const new_channel_name = document.querySelector('#channel_name').value;
        var retrievedObject = localStorage.getItem('channels');
        const list3 = JSON.parse(retrievedObject)
        list3.push(new_channel_name);
        
        // add list to local storage
        localStorage.setItem('channels', JSON.stringify(list3));
    } catch (e) {
        console.log(e);
    }
}
});



//WORK WITH MESSAGES
            
document.addEventListener('DOMContentLoaded', () => {
                
    if (!localStorage.getItem('room1'))
    localStorage.setItem('room1', JSON.stringify([]))

    // dislay old messages form storage
    const messages_list_element = document.querySelector('#messages_list');
    const messages_list_from_storage = localStorage.getItem('room1');
    
    const messages_list_to_show = JSON.parse(messages_list_from_storage);
    
    for (const message_item of messages_list_to_show) {
        const item3 = document.createElement('li');
        item3.appendChild(document.createTextNode(message_item));
        messages_list_element.appendChild(item3);
    }

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //display new messages
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

                const message = `${datetime} ${localStorage.getItem('username')}: ${document.querySelector('#new_message').value}`;
                console.log(message);  
                var retrievedObject = localStorage.getItem('room1');
                const list = JSON.parse(retrievedObject)
                list.push(message);
                socket.emit('submit message', {'message' : message});

                // add list to local storage
                localStorage.setItem('room1', JSON.stringify(list));

                // Clear input field and disable button again
                document.querySelector('#new_message').value = '';
                return false;

            } catch (e) {
                console.log(e);
            }
        };
    });
    
    //write new messages
    socket.on('display message', data => {
        const messages_list_element = document.querySelector('#messages_list');
        const li = document.createElement('li');
        //li.innerHTML = `${localStorage.getItem('username')}: ${data.message}`;
        li.innerHTML = `${data.message}`;
        document.querySelector('#messages_list').append(li);
    });
});