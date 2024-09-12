<template>
  <div class="app">
    <div v-if="showModal" class="ui modal active">
      <h1 class="ui header">
        体調記録
      </h1>
      <form class="ui form" @submit.prevent="submitSymptoms">
        <div class="field">
          <label>ほてり 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.hot" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.hot }}</p>
        </div>
        <div class="field">
          <label>冷え 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.cool" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.cool }}</p>
        </div>
        <div class="field">
          <label>腰痛 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.waist" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.waist }}</p>
        </div>
        <div class="field">
          <label>イライラ 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.irritation" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.irritation }}</p>
        </div>
        <div class="field">
          <label>めまい 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.dizziness" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.dizziness }}</p>
        </div>
        <div class="field">
          <label>息切れ 1(軽い)-5(重い)</label>
          <input 
            v-model="symptoms.bless" 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            class="range-input"
          />
          <p>選択したスコア: {{ symptoms.bless }}</p>
        </div>

        <div class="actions">
          <button class="ui button" @click="closeModal">キャンセル</button>
          <button class="ui button primary" type="submit">記録を保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "RecordSymptoms",
  data() {
    return {
      symptoms: {
        hot: 3,         // ほてり
        cool: 3,        // 冷え
        waist: 3,       // 腰痛
        irritation: 3,  // イライラ
        dizziness: 3,   // めまい
        bless: 3,       // 祝福感 (ポジティブ感覚)
      },
      showModal: true,
      email: "", // ログインしているユーザーのメールアドレス
    };
  },
  
  created() {
    this.email = localStorage.getItem("email");
    if (!this.email) {
      // ログインしていない場合、ログインページにリダイレクト
      this.$router.push({ name: "Login" });
    }
  },
  
  methods: {
    // 症状の記録を送信
    async submitSymptoms() {
      const reqBody = {
        email: this.email, // ログインしたユーザーのメールアドレス
        hot: this.symptoms.hot, // 記録した症状データ
        cool: this.symptoms.cool,
        irritation: this.symptoms.irritation,
        waist: this.symptoms.waist,
        dizziness: this.symptoms.dizziness,
        bless: this.symptoms.bless
      };

      try {
        const res = await fetch(`${baseUrl}/fit/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
        const jsonData = await res.json();
        if (!res.ok) {
          throw new Error(jsonData.message || "記録の保存に失敗しました");
        }
        console.log("記録成功:", jsonData);
        this.$router.push({ name: "Reservation" }); // 記録成功後にReservationページに移動
      } catch (error) {
        console.error("記録の保存に失敗しました:", error);
      }
    },

    // モーダルを閉じてReservationページへ移動
    closeModal() {
      this.showModal = false;
      this.$router.push({ name: "Reservation" });
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
</style>