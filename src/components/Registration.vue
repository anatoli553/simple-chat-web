<template>
  <h1>Welcome to the Simple Chat</h1>
  <h3>Log in and chat</h3>
  <form class="auth" @submit.prevent="handleSubmit">

    <h2>Create account</h2>

    <div class="form-group">
      <label>Username</label>
      <input type="text" class="form-control" v-model="username" placeholder="Username">
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" v-model="password" placeholder="Password">
    </div>

    <button class="btn btn-login">Register</button>
    <div class="form-footer">
      <label>Already have an account?   </label>
      <a href="/" class="switch-form">Log in</a>
    </div>

  </form>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Registration",
    props: ['registration'],
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      async handleSubmit(){
        const data = {
          username: this.username,
          password: this.password
        }
        const res = await axios.post("auth/registration", data)
        console.log(res);
        if(res.data.token){
          localStorage.setItem('token', res.data.token.accessToken)
          localStorage.setItem('rooms',res.data.rooms)
          this.$router.push('/chat')
        }else{
          alert(res.data.response)
        }
      }
    }
  }
</script>

<style scoped>
.auth{
  width: 400px;
  height: 400px;
  margin: 0 auto;
  box-shadow: 0px 0px 21px 2px rgba(34, 60, 80, 0.2);
  background: #fcfcfc;
  display: flex;
  flex-direction: column;
}
h2{
  font-size: 36px;
  margin-bottom: 80px;
}
h3{
  margin-bottom: 80px;
}
.form-group{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
}
.form-control{
  width: 250px;
  height: 30px;
  border: none;
  background: white;
  border: 1px solid gray;
  border-radius: 10px;
  padding-left: 20px;
}
.btn{
  width: 300px;
  height: 40px;
  border: none;
  background: lightgreen;
  border-radius: 15px;
  margin: 40px auto;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: bold;
}
.switch-form{
  text-decoration: underline;
  cursor: pointer;
  color: black;
}
</style>