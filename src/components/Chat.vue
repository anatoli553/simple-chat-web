<template>
  <header>
    <h1>Simple Chat</h1>
    <button type="button" class="logout" v-on:click="logout">Logout</button>
  </header>
  <div class="chat">
    <div class="rooms">
      <h2>Rooms</h2>
      <div class="rooms-wrapper">
        <div class="rooms-container">
        <button class="room-btn" v-for="room of Object.keys(rooms)" :class="{ active: activeRoom == room }" @click="activeRoom = room; toggleRoomMembership() " v-bind:roomName="room">{{room}}</button>
        </div>
      <form class="create-room">
        <input v-model="createRoomName" type="text" class="room-input" placeholder="Enter the name of the room"/>
        <button type="submit" class="btn-create-room btn" @click.prevent="createRoom()">Create</button>
      </form>
      </div>
    </div>
    <div class="chat-section">
      <h2>Welcome to the chat, {{username}}</h2>
      <ul class="chat-messages">
        <li class="message" v-for="msg of messages[activeRoom]">
          <strong class="sender">{{ msg.sender }}:</strong><strong class="chat-message"> {{ msg.message }}</strong><strong class="date">{{msg.date}}</strong>
        </li>
      </ul>

      <form class="send-message">
        <input v-model="text" type="text" placeholder="Write your message" class="message-input" maxlength="255"/>
        <button type="submit" class="btn-send btn" @click.prevent="sendChatMessage()" >Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const io = require("socket.io-client")

export default {
  name: 'Chat',
  data() {
    return {
      username: '',
      text: '',
      messages: {
        general: [],
      },
      createRoomName: '',
      socket: {
        chat: null,
      },
      activeRoom: "general",
      rooms: {
        general: false,
      }
    }
  },
  async created() {
      const res = await axios.get('users/getByToken', {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
      this.username=res.data.username;
      if(!this.username) {
        this.$router.push('/')
      }
    const initRooms = localStorage.rooms.split(',')
    if(initRooms!=''){
      initRooms.forEach(room =>{
        this.messages[room]=[];
        this.rooms[room]=false;
      })
    }
    this.socket.chat = io('http://localhost:3000/chat');
    this.socket.chat.emit('sendMessages');
    this.socket.chat.on('chatToClient', (msg) => {
      console.log(msg)
      this.receiveChatMessage(msg);
    });
    this.socket.chat.on('connect', () => {
      this.toggleRoomMembership();
    });
    this.socket.chat.on('joinedRoom', (room) => {
      this.rooms[room] = true;
    });
    this.socket.chat.on('leftRoom', (room) => {
      this.rooms[room] = false;
    });
    this.socket.chat.on('newChat', (room) => {
      this.messages[room]=[];
      this.rooms[room] = false;
      let buffRoom = localStorage.getItem('rooms').split(',')
      buffRoom.push(room)
      localStorage.setItem('rooms', buffRoom.join(','))
    });
    this.socket.chat.on('receiveMessages',(messages) => {
      console.log(messages)
      console.log(Object.keys(messages))
      Object.keys(messages).forEach(room=>{
        this.messages[room]=messages[room];
      })
    })
    },
  computed: {
    isMemberOfActiveRoom() {
      return this.rooms[this.activeRoom];
    }
  },
  methods: {
    logout(){
      localStorage.removeItem("token")
      this.$router.push('/')
    },
    sendChatMessage() {
        this.socket.chat.emit('chatToServer', { sender: this.username, room: this.activeRoom, message: this.text });
        this.text = "";
    },
    createRoom() {
      this.socket.chat.emit('createNewRoom', this.createRoomName)
      this.createRoomName='';
    },
    receiveChatMessage(msg) {
      this.messages[msg.room].push(msg);
    },
    toggleRoomMembership() {
      if (!this.isMemberOfActiveRoom) {
        this.socket.chat.emit('joinRoom', this.activeRoom);
      }
    },
  }
}
</script>

<style scoped>
  header{
    width: 830px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .logout{
    width: 120px;
    padding: 5px 20px;
    height: 40px;
    text-align: center;
    background: rgba(250,187,181,0.82);
    border: 1px solid black;
    border-radius: 10px;
  }
  .chat{
    width: 830px;
    height: 500px;
    margin: 50px auto 0px auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .rooms{
    width: 300px;
    height: 500px;
    border: 3px solid black;
    border-radius: 10px;
  }
  .rooms-container{
    height: 350px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .room-btn{
    padding: 5px 20px;
    font-size: 16px;
    margin-bottom: 5px;
    width: 260px;
    border: none;
    border-radius: 4px;

  }
  .chat-section{
    width: 500px;
    height: 500px;
    border: 3px solid black;
    border-radius: 10px;
  }
  .chat-messages{
    height: 350px;
    overflow: scroll;
  }
  .send-message{
    width: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
  }
  .message-input{
    width: 300px;
  }
  .btn-send{
    background: white;
    border-radius: 3px;
    width: 80px;
  }
  .rooms-wrapper{
    height: 400px;
    display: flex;
    flex-direction: column;
    align-content: space-between;
    justify-content: space-between;
  }
  .create-room{
    width: 250px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
  }
  .room-input{
    max-width: 200px;
  }
  .btn-create-room{
    background: white;
    border-radius: 3px;
    width: 60px;
  }
  .message{
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 440px;
  }
  .chat-message{
    width: 340px;
    color: #181616;
    font-size: 14px;
    word-break: break-all;
    text-align: left;
  }
  .sender{
    margin-right: 5px;
    word-break: normal;
  }
  .date{
    margin-right: 10px;
    font-size: 12px;
    word-break: normal;
    color: #5a5755
  }
  .active {
    background: lightblue;
  }

  .message-input{
    width: 250px;
    height: 30px;
    border: none;
    background: white;
    border: 1px solid gray;
    border-radius: 10px;
    padding-left: 20px;
  }
  .room-input{
    width: 170px;
    height: 30px;
    background: white;
    border: 1px solid gray;
    border-radius: 10px;
    padding-left: 10px;
  }

</style>