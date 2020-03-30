function displayNewMessage(data) {
    const tableRow = createNewRow();
    const tableColumn = createNewColumn();
    const deleteButton = deleteOption();
    tableColumn.id = data.message.id;
    
    if (localStorage.getItem('username') == data.message.user) {
        const messageToDisplay = `${data.message.time} ${data.message.user}: ${data.message.message}`;
        tableColumn.appendChild(document.createTextNode(messageToDisplay));
        tableRow.appendChild(tableColumn);
        tableRow.appendChild(deleteButton);
    } else {
        const messageToDisplay = `${data.message.time} ${data.message.user}: ${data.message.message}`;
        tableColumn.appendChild(document.createTextNode(messageToDisplay));
        tableRow.appendChild(tableColumn);
    }
    document.querySelector('#messages_list').append(tableRow);

    deleteButton.onclick = (evt) => {
        event.preventDefault();
        console.log({data})
        const dataToDelete = data['message']
        deleteMessage(dataToDelete);
    }
};