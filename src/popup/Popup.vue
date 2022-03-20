<template>
  <div>
    <p>popup sample</p> 
    <div v-if="!authenticatedUser">
      <button @click="loginUser" class="c-Button c-Button--close">login</button>
    </div>
     <div v-else>
      <button @click="loginoutUser" class="c-Button c-Button--close">logout</button>
      <p>{{ this.email }}</p>
      <p>{{ this.displayName }}</p>
      <img :src="this.photoURL"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { firebaseConfig } from './firebase_config'
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    signOut,
    onAuthStateChanged,　
    signInWithCredential,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence,
    Auth
} from 'firebase/auth';

export default defineComponent({
  name: 'Popup',
  data() {
    return { 
      authenticatedUser: false,
      auth:  {} as Auth,
      email: '',
      displayName: '',
      photoURL: ''
    }
  },
  setup() {
    return {}
  },
  mounted(){
    const firebaseApp = initializeApp(firebaseConfig)
    this.auth = getAuth(firebaseApp)
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('login')
        this.authenticatedUser = true
        this.email = user.email ?? ''
        this.displayName = user.displayName ?? ''
        this.photoURL = user.photoURL ?? ''
      } else {
        console.log('logout')
        this.authenticatedUser = false;
      }
    });     
  },
  methods: {
    loginUser() {
      // ChromeアプリからGoogleログインしてトークン取得
      chrome.identity.getAuthToken(
        {interactive: true},
        (token: string) => {
          console.log('token', token)
          // Googleログイン成功時に受け取るトークンを使ってGoogleのクレデンシャル作成
          const credential = GoogleAuthProvider.credential(null, token)
          console.log('credential:', credential)
          console.log('auth:', this.auth)

          // Googleユーザーのクレデンシャルを使ってサインイン
          signInWithCredential(this.auth, credential).then((result) => {
            console.log("Sign In Success", result)
          }).catch((error) => {
            console.log("Sign In Error", error)
          })
        }
      )
    },
    loginoutUser(){
      this.auth.signOut()
    }
  },
})

</script>

<style scoped>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: yellow;
}
</style>