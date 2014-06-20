## XWindow - The cross-tab communication library

XWindow lets you communicate between tabs of same domain in real-time. This is done through HTML5 localStorage events which any tab in the same domain can listen to. Browsers supported: IE 9+, FF 4+, Chrome.

### Sending message

To broadcast a message
```javascript
XWindow.broadcast("my custom message");
```

### Receiving message

To listen to messages
```javascript
XWindow.listen(function(payload){
	console.log(payload.data);
});
```

### FAQ

 1. **Can I send a JSON object?**

 Yes, you can send it as either JSON or plain string

 2. **I don't want to broadcast, can I send it to just one tab?**

 Unfortunely, this is feature has been removed due to cross-browser issues. However you can implement a custom requestedBy-responseFor logic using a unique id internally in your JSON.

 3. **I have multiple subscribers in the same tab, how can I cancel bubbling of the event to other subscribers?**

 Return false on listener:
 ```javascript
    XWindow.listen(function(payload){
    	console.log(payload.data);
    	return false;
    });
 ```
Last listener will be invoked first for your convenience.

### License
This library is released under the MIT License