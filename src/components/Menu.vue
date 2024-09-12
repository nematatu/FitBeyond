<template>
  <div class="ui secondary pointing green inverted massive menu">
    <router-link active-class="active" class="item" exact to="/">
      Home
    </router-link>
    <router-link active-class="active" class="item" to="/Confirm">
      Confirm
    </router-link>
    <router-link active-class="active" class="item" to="/Community">
      Community
    </router-link>

    <div class="right menu">
      <a @click="logout" class="item">Logout</a>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";
export default {
  name: "Menu",
  computed: {},
  methods: {
    logout() {
      window.localStorage.clear();
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped></style>
