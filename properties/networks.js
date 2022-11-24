// import {over} from 'stompjs';
// import SockJS from 'sockjs-client';


export const host = "10.0.2.2";
// export const host = "chitchat-chat-app.herokuapp.com";
// export const host = "ec2-54-227-7-13.compute-1.amazonaws.com";
export const port = "8080";

export const socketURL = 'http://'+host+':'+port+'/ws';

export const idToPhoneUrlPath = 'http://'+host+':'+port+'/api/id-to-phone'
export const phoneToIdUrlPath = 'http://'+host+':'+port+'/api/phone-to-id'

// let Sock = new SockJS(socketURL);
// export const stompClient = over(Sock);