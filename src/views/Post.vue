<template>
  <div class="app">
    <Menu />

    <div v-if="showModal" class="ui modal active">
      <h1 class="ui header">
        投稿
        </h1>
        <form class="ui form">
          <div class="field">
            <input v-model="post.text" type="text" class="comment-input" placeholder="comment">
            <div class="ui card fluid inritu">
             <div class="content">
               <div class="header">
           {{ training.title || "No Title Available" }}
      </div>
      <div class="meta">
      <span class="right floated time">           {{
            training.start
              ? new Date(training.start ).toLocaleString()
              : "No start time"
          }}</span>
        <span class="meta">{{ training.category || "Unknown" }}</span>
        </div>
        <div class="description">
        
          {{ training.description || "No description available" }}
        
      </div>
        </div>
        <div class="extra content">
          <div class="right floated author">
          <img class="ui avatar image" src="../../public/default.jpg">
          test
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="ui button " @click="cancelPost">Close</button>
        <button class="ui button primary"  @click="postArticle" >投稿</button>
      </div>
      </div>
      </form>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Post",
  components: {
    Menu,
  },
  data() {
    return {
      training: {}, // トレーニング情報を保持
      post: {
        text: "", // 投稿内容
      },
      trainingId: null, // 現在のトレーニングID
      showModal: true,
    };
  },
  
  computed: {
    isPostFormValid() {
      return this.post.text.length > 0; // テキストが入力されていれば投稿可能
    },
  },
  
  created() {
    //後で変える！！！！
    localStorage.setItem("trainingId",12);
    //後で変える！！！！
    this.trainingId=localStorage.getItem("trainingId");
    if (this.trainingId) {
       this.fetchTraining();
    }
  },
  
  methods: {
    // トレーニング情報を取得
    async fetchTraining() {
      try {
      const fetchURL=`${baseUrl}/fit/training?trainingId=${this.trainingId}`;
      console.log(fetchURL);
        const res = await fetch(
          fetchURL,
          {
            method: "GET",
          },
        );
        const jsonData = await res.json();
        console.log("jsonData:",jsonData);
        if (!res.ok) {
          throw new Error(
            jsonData.message || "トレーニング情報の取得に失敗しました",
          );
        }
        this.training = jsonData; // トレーニング情報をセット
      } catch (error) {
        console.error("トレーニング情報の取得に失敗しました:", error);
      }
    },
    // 投稿処理
    async postArticle() {
      const email = localStorage.getItem("email");
      parseInt(this.trainingId);
      const reqBody = {
        email,
        trainingId: this.trainingId,
        text: this.post.text, // ユーザーが入力した投稿内容
      };
      console.log(reqBody);

      try {
        const res = await fetch(`${baseUrl}/fit/article`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
        const jsonData = await res.json();
        if (!res.ok) {
          throw new Error(jsonData.message || "投稿に失敗しました");
        }
        console.log("投稿成功:", jsonData);
        this.$router.push({ name: "Community" }); // 投稿成功後にCommunityコンポーネントに移動
      } catch (error) {
        console.error("投稿に失敗しました:", error);
      }
    },
    // 投稿をキャンセルしてCommunityページへ移動
    cancelPost() {
      console.log("cancel");
      this.showModal = false;
      this.$router.push({ name: "Confirm" });
    },
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.ui.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.actions{
  text-align: right; /* ボタン全体を右端に揃える */
}
input{
  border:none;
  outline:none;
}
.inritu{
  padding:2rem;
}
.description{
  margin:2rem ;
}
</style>
