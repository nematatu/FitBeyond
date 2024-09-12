<template>
  <div class="app">
    <div v-if="showModal" class="ui modal active">
      <h1 class="ui header">
        トレーニング回答
      </h1>
      <form class="ui form">
        <div class="field">
          <label>トレーニングの評価 (1〜5)</label>
          <input 
            v-model="response.score" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ response.score }}</p>
        </div>
        <div class="ui card fluid training-info">
          <div class="content">
            <div class="header">{{ training.title || "No Title Available" }}</div>
            <div class="meta">
              <span class="right floated time">{{ training.start ? new Date(training.start).toLocaleString() : "No start time" }}</span>
              <span class="meta">{{ training.category || "Unknown" }}</span>
            </div>
            <div class="description">
              {{ training.description || "No description available" }}
            </div>
          </div>
          <div class="extra content">
            <div class="right floated author">
              <img class="ui avatar image" src="../../public/default.jpg">
              {{ trainerName || "トレーナー情報なし" }}
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="ui button" @click="closeModal">キャンセル</button>
          <button class="ui button primary" type="submit" :disabled="!isResponseFormValid" @click="submitResponse">回答を投稿</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "RecommendResponse",
  data() {
    return {
      training: {}, // トレーニング情報を保持
      response: {
        score: 3, // range入力の初期値
      },
      trainingId: null, // 現在のトレーニングID
      showModal: true,
    };
  },
  
  computed: {
    isResponseFormValid() {
      return this.response.score >= 1 && this.response.score <= 5; // スライダーが1〜5の範囲にある場合は投稿可能
    },
  },
  
  created() {
    this.trainingId = localStorage.getItem("trainingId");
    if (this.trainingId) {
      this.fetchTraining();
    }
  },
  
  methods: {
    // トレーニング情報を取得
    async fetchTraining() {
      try {
        const fetchURL = `${baseUrl}/fit/training?trainingId=${this.trainingId}`;
        const res = await fetch(fetchURL, { method: "GET" });
        const jsonData = await res.json();
        if (!res.ok) {
          throw new Error(jsonData.message || "トレーニング情報の取得に失敗しました");
        }
        this.training = jsonData;
      } catch (error) {
        console.error("トレーニング情報の取得に失敗しました:", error);
      }
    },

    // 回答投稿処理
    async submitResponse() {
      const email = localStorage.getItem("email");
      const reqBody = {
        email,
        trainingId: this.trainingId,
        score: this.response.score, // ユーザーが選択したスコア
      };

      try {
        const res = await fetch(`${baseUrl}/fit/response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
        const jsonData = await res.json();
        if (!res.ok) {
          throw new Error(jsonData.message || "回答の投稿に失敗しました");
        }
        console.log("回答成功:", jsonData);
        this.$router.push({ name: "Community" }); // 回答成功後にCommunityページに移動
      } catch (error) {
        console.error("回答の投稿に失敗しました:", error);
      }
    },

    // モーダルを閉じてCommunityページへ移動
    closeModal() {
      this.showModal = false;
      this.$router.push({ name: "Community" });
    },
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSS */
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
.actions {
  text-align: right; /* ボタン全体を右端に揃える */
}
.range-input {
  width: 100%;
}
.training-info {
  padding: 1rem;
}
.description {
  margin: 1rem 0;
}
</style>