(function(w) {
	/**
	@author Cyril Sebastian

	Copyrights for code authored by Yahoo! Inc. is licensed under the following
	terms:
	MIT License
	Copyright 2014 Yahoo! Inc.

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	var XWindow = function(){
		this.globalKey = "__XWindowMessage";
		this.listeners = [];
		this.lastTimetamp;
		this.clientId = "XWindow_"+Math.floor(Math.random()*10000);	
		this.timeout = 1000;
		var self = this;

		// Broadcasts a message
		this.broadcast = function(message){
			var timestamp = new Date().getTime()+""+ Math.floor(Math.random()*100);
			w.localStorage.setItem(self.globalKey, JSON.stringify({"data":message, "timestamp": timestamp, "sourceId": self.clientId}));
		};


		// Listens to incoming messages
		this.listen = function(callback){
			if(!callback || typeof callback != "function") return;
			if(!self.listeners.length){
				w.addEventListener && w.addEventListener("storage", self._delegateEvent, false);
			}
			self.listeners.push(callback);
		};

		
		// internal fns

		this._delegateEvent = function(e){
			var payload;
			
			if(e.key != self.globalKey || !e.newValue) return;	//could be from any other agent
			try{ payload = JSON.parse(e.newValue); } catch(e){ return; }
			
			if(payload.sourceId == self.clientId || payload.timestamp == self.lastTimetamp || payload.timestamp < (new Date().getTime() - self.timeout)) return;
			self.lastTimetamp = payload.timetamp;
			
			for (var i = self.listeners.length - 1; i >= 0; i--) {	//last one first
				var returnValue = self.listeners[i]({'sourceId': payload.sourceId, 'data': payload.data});
				if(returnValue === false) return;	//stop bubbling
			}
		};

		if(!w.localStorage) this.broadcast = this.listen = function(){};
	};
	

	w.XWindow = new XWindow();
	
})(window);