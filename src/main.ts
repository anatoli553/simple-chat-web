import { createApp } from 'vue'
import App from './App.vue'
import Login from "@/components/Login.vue";
import Registration from "@/components/Registration.vue";
import {createRouter, createWebHistory} from "vue-router";
import './axios/axios'
import Chat from "@/components/Chat.vue";

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/registration',
        component: Registration
    },
    {
        path: '/chat',
        component: Chat
    }
];
const router = createRouter({history: createWebHistory(), routes})



createApp(App).use(router).mount('#app')
