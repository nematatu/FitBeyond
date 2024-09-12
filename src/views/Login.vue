<template>
  <div class="logbody">
  <div v-if="errorMessage" class="ui error message">
    {{ errorMessage }}
  </div>

  <div class="login-container">
    <h1>ログイン</h1>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="username">メールアドレス</label>
        <input type="text" id="username" name="username" placeholder="email" v-model="user.email" required>
      </div>

      <div class="form-group">
        <label for="password">パスワード</label>
        <input type="password" id="password" name="password" placeholder="Password" v-model="user.password" required>
      </div>

      <div class="field" v-if="!isLogin">
        <div class="">
          
          <input type="text" placeholder="Username" v-model="user.username" />
        </div>
      </div>

      <button type="submit" @click="toggleMode">
        {{ submitText }}
      </button>
    </form>
  </div>

  <div>
    <button @click="toggleMode">
      {{ toggleText }}
    </button>
  </div>
</div>

</template>

<script>
import { baseUrl } from "@/assets/config.js";

// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
  name: "Login",

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      isLogin: true,
      user: {
        email: null,
        password: null,
        username: null,
      },
      errorMessage: "",
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? "Login" : "SignUp";
    },
    toggleText() {
      return this.isLogin ? "SignUp" : "Login";
    },
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    //先にtoggleされて、その後にisLoginを評価するんやね
    toggleMode() {
      this.isLogin = !this.isLogin;
      console.log(this.isLogin);
    },
    async submit() {
      if (this.isLogin) {
        const headers = { Authorization: "fit" };
        // リクエストボディを指定する
        const reqBody = {
          username: this.user.username,
          password: this.user.password,
          email: this.user.email,
        };
        console.log("signup");
        try {
          /* global fetch */
          const res = await fetch(baseUrl + "/fit/user/signup", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers,
          });

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage =
              jsonData.message ?? "エラーメッセージがありません";
            throw new Error(errorMessage);
          }

          // 成功時の処理
          window.localStorage.setItem("token", jsonData.token);
          window.localStorage.setItem("email", this.user.email);
          console.log(jsonData);
          this.$router.push({ name: "RecommendBefore" });
        } catch (e) {
          this.errorMessage = e;
          console.error(e);
          errorMessage = e.message;
          // エラー時の処理
        }
      }
      const headers = { Authorization: "fitToken" };
      // リクエストボディを指定する
      const reqBody = {
        email: this.user.email,
        password: this.user.password,
      };
      console.log(this.user.email,this.user.password);
      try {
        /* global fetch */
        const res = await fetch(baseUrl + "/fit/user/login", {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
          this.errorMessage = errorMessage;
        }

        window.localStorage.setItem("token", jsonData.token);
        window.localStorage.setItem("email", this.user.email);

        this.$router.push({ name: "RecommendBefore" });
        // 成功時の処理
        console.log(jsonData);
      } catch (e) {
        console.error(e);
        errorMessage = e.message;
        // エラー時の処理
      }
    },
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
