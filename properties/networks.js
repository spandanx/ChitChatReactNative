// import {over} from 'stompjs';
// import SockJS from 'sockjs-client';


export const host = "10.0.2.2";
// export const host = "chitchat-chat-app.herokuapp.com";
// export const host = "ec2-54-227-7-13.compute-1.amazonaws.com";
export const port = "8086";//"8080";
export const chat_service_prefix = '/user-service';
export const ws_service_prefix = '/ws-service';

export const socketURL = 'http://'+host+':'+port+ws_service_prefix+'/ws';

export const idToPhoneUrlPath = 'http://'+host+':'+port+chat_service_prefix+'/api/id-to-phone'
export const phoneToIdUrlPath = 'http://'+host+':'+port+chat_service_prefix+'/api/phone-to-id'

// let Sock = new SockJS(socketURL);
// export const stompClient = over(Sock);
export const jwtTokenUser = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTcwMjM3NjYwMywiaWF0IjoxNjcwODQwNjAzfQ.xwF8arNO2zdKCYAdMkKs4keepDIy2Hg1Xv8pJzzeS3A';

export const publicPath = 'http://'+host+':'+port+chat_service_prefix+'/api/public';