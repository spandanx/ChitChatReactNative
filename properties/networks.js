// import {over} from 'stompjs';
// import SockJS from 'sockjs-client';


export const host = "10.0.2.2";
export const port = "8080";

export const socketURL = 'http://'+host+':'+port+'/ws';

export const idToPhoneUrlPath = 'http://'+host+':'+port+'/api/id-to-phone'
export const phoneToIdUrlPath = 'http://'+host+':'+port+'/api/phone-to-id'

// let Sock = new SockJS(socketURL);
// export const stompClient = over(Sock);