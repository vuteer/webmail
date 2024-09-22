import io from 'socket.io-client';
import envs from '@/config/env';

// const socket = io.connect(envs.socketUrl);
// const socket = io(envs.socketUrl, { autoConnect: true });

class Socket {
  constructor () {
    this.socket = null;
    this.user = null;

    this.listeners = [];

    this.addOrdersToState = null; 
    this.addNewThread = null; 
  }

  destroy () {
    if (this.socket?.connected) {
      this.socket.close(); 
      this.socket = null; 
      this.user = null; 
      this.listeners = []
    }
  }

  initialize (user, addNotificationToState, notificationSoundRef, addToNumber, addNewThread) {
    this.user = user;
    this.socket = io (envs.base_api_url, {autoConnect: true, transports: ['websocket'], query: {user: user.id}});
    
    this.addNotificationToState = addNotificationToState;
    this.notificationSoundRef = notificationSoundRef;  
    
    this.addToNumber = addToNumber; 
    this.addNewThread = addNewThread; 

    this.socket.on ('connect', () => {
      console.log (
        '%c Online',
        'background: #1b2a47; color: #6dd47e; font-size: 13px; padding: 5px; border-radius: 5px; letter-spacing: 2px;'
      );
      
      this.socket.emit ('register', {id: user.id, type: 'user'});
    });

    this.socket.on("new-mail", data => this.newMail(data))
  }

  newMail(data) {
    this.addToNumber("inbox");
    this.addNewThread(data)
    this.addNotificationToState({...data, type: "mail"}, this.notificationSoundRef)
 
  }

 
}

export const socket = new Socket ();