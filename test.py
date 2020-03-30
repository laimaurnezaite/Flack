data = {'message': {'user': 'Laima', 'time': '29/3/2020 @ 21:18:50', 'message': 'kokok', 'isDeleted': False}}
message = data["message"]
print(message)

message["user"] = "zilvinas"
print(message)



# message = data["message"]["message"]
# data["message"]["message"] = "This message was removed"



# trying to delete old message
{'message': {'user': 'f', 'time': '30/3/2020 @ 13:39:21', 'message': 'asf', 'isDeleted': False, 'id': '1585564761736f'}}

# trying to delete new message
{'message': {'user': 'f', 'time': '30/3/2020 @ 13:48:43', 'message': 'laima', 'isDeleted': False, 'id': '1585565323323f'}}