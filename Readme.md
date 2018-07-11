## How to Install
```shell
npm install
cd public
npm install --prefix . bootstrap
```

## Chat Application with Node.JS
You can follow [this tutorial](https://socket.io/get-started/chat/) to create
a likewise application.

So far my progress:

- [x] Broadcast a message to connected users when someone connects or disconnects
- [x] Add support for nicknames
- [x] Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
- [x] Add “{user} is typing” functionality
- [ ] Show who’s online
- [ ] Add private messaging
- [ ] Share your improvements!
