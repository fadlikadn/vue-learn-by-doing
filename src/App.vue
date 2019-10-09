<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/secure" v-if="isLoggedIn">Secure</router-link>
      <span v-if="!isLoggedIn"> | <a @click="login">Login</a></span>
      <span v-if="!isLoggedIn"> | <a @click="register">Register</a></span>
      <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
    </div>
    <router-view/>
  </div>
</template>

<script>

// export default {
//   name: 'app',
//   components: {
//     HelloWorld
//   }
// }

export default {
  // <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
    },
    login: function() {
      this.$router.push('/login');
    },
    register: function() {
      this.$router.push('/register')
    }
  },
  created: function() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        console.log(resolve, reject);
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err;
      });
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
