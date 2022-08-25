<template>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Login from "@/components/Login.vue";
import Registration from "@/components/Registration.vue";
import Chat from "@/components/Chat.vue";

@Options({
  components: {
    Registration,
    Login,
    Chat
  },
})
export default class App extends Vue {

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
