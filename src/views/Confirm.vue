<template>
  <Menu />
  <div class="ui main container">
    <h1>予約したトレーニング一覧</h1>
    <div v-if="reservedTrainings.length === 0" class="ui message">
      <p>予約されたトレーニングはありません。</p>
    </div>
      <ul class="ui three column grid">
      <template v-for="(item, index) in filteredreservedTrainings" :key="index">
        <li class="column" @click="openModal(item)">
          <div class="ui card fluid">
            <div class="image">
              <!-- サムネイル画像 -->
              <img src="../../public/default.jpg" alt="Thumbnail" />
            </div>
            <div class="content">
              <h2 class="header">{{ item.title || "No Title Available" }}</h2>
              <span class="meta"
                >Trainer: {{ item.trainerName || "Unknown" }}</span
              >
              <div class="description">
                {{ item.description || "No description available" }}<br />
                Category: {{ item.category || "No category available" }}<br />
                Start:
                {{
                  item.start
                    ? new Date(item.start ).toLocaleString()
                    : "No start time"
                }}<br />
                End:
                {{
                  item.end
                    ? new Date(item.end ).toLocaleString()
                    : "No end time"
                }}<br />
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>

  <div class="ui main container">
    <h1>終了したトレーニング一覧</h1>

      <ul class="ui three column grid">
      <template v-for="(item, index) in finishedTraining" :key="index">
        <li class="column" @click="openModal2(item)">
          <div class="ui card fluid">
            <div class="image">
              <!-- サムネイル画像 -->
              <img src="../../public/default.jpg" alt="Thumbnail" />
            </div>
            <div class="content">
              <h2 class="header">{{ item.title || "No Title Available" }}</h2>
              <span class="meta"
                >Trainer: {{ item.trainerName || "Unknown" }}</span
              >
              <div class="description">
                {{ item.description || "No description available" }}<br />
                Category: {{ item.category || "No category available" }}<br />
                Start:
                {{
                  item.start
                    ? new Date(item.start ).toLocaleString()
                    : "No start time"
                }}<br />
                End:
                {{
                  item.end
                    ? new Date(item.end ).toLocaleString()
                    : "No end time"
                }}<br />
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>

  <!-- モーダル -->
  <div v-if="showModal" class="ui modal active">
      <h1 class="ui header">
        {{ selectedTraining.title }}
        </h1>
          <div class="field">
            <div class="ui card fluid ">
             <div class="content">
               <div class="header">
           
      </div>
      <div class="meta">
      <span class="">           
            {{ selectedTraining.trainerName }}
          </span>
        </div>
        <div class="description">
        
         {{ selectedTraining.description }}
        
      </div>
        </div>
        <div class="extra content">
          <a :href="selectedTraining.zoomUrl">
            {{ selectedTraining.zoomUrl }}
          </a>
        </div>
      </div>
      <div class="actions">
        <button v-if='postflag' class="ui button " @click="closeModal">投稿</button>
        <button class="ui button " @click="closeModal">Close</button>
      </div>
      </div>
    </div>
</template>

<script>
import Menu from "@/components/Menu.vue";
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Confirm",

  components: {
    Menu,
  },

  data() {
    return {
      finishedTraining:{},
      ongoingTrainings:{},
      filteredreservedTrainings:{},
      trainings: [], // 全トレーニング
      reservedTrainings: [], // 予約済みトレーニング
      trainingIds: [], // ユーザーの予約したトレーニングID
      userEmail: localStorage.getItem("email"), // ユーザーのメールアドレス
      showModal: false, // モーダル表示フラグ
      selectedTraining: {}, // 選択されたトレーニング
      localTrainingId:null,
      postflag:false
  }
  },
   async created() {
    this.fetchUserTrainingIds(); // ユーザーの予約したトレーニングIDを取得
    this.fetchTrainings(); // 全トレーニングを取得
    this.testfunc();
    //this.filterReservedTrainings(); // 予約済みトレーニングを絞り込み
    //this.checkTrainingEndTime(); // トレーニング終了時間をチェック
  },

  methods: {
    async fetchUserTrainingIds() {
      try {
        const res = await fetch(`${baseUrl}/fit/user?email=${this.userEmail}`, {
          method: "GET",
        });
        const jsonData = await res.json();

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "error not found";
          throw new Error(errorMessage);
        }
        this.trainingIds = jsonData.trainingIds ?? [];
        console.log("fetchUser関数のtrainingIds:",this.trainingIds);
        
      } catch (e) {
        console.error("ユーザー情報の取得に失敗しました:", e);
      }
    },

    async fetchTrainings() {
      try {
        const res = await fetch(baseUrl + "/fit/trainings", {
          method: "GET",
        });
        const jsonData = await res.json();
        if (!res.ok) {
          const errorMessage = jsonData.message ?? "error not found";
          throw new Error(errorMessage);
        }

        this.trainings = jsonData.Trainings ?? [];
        console.log("fetchTrainings関数でのtrainingIds",this.trainingIds);
      } catch (e) {
        console.error("トレーニングの取得に失敗しました:", e);
      }
    },
    
    async testfunc(){
    try {
        const res = await fetch(baseUrl + "/fit/trainings", {
          method: "GET",
        });
        const jsonData = await res.json();
        
        this.trainings = jsonData.Trainings ?? [];
        
      // trainingIdsに一致するトレーニングを抽出
      const now = Date.now() ;  // 現在時刻を秒で取得
      this.reservedTrainings = this.trainings.filter((training) =>
        this.trainingIds.includes(training.trainingId) 
      );

      this.filteredreservedTrainings=this.reservedTrainings.filter((training)=>
        training.end>=now
    ),
      
      this.finishedTraining = this.reservedTrainings.filter(
        (training) => training.end && training.end <= now,
      );

    
        console.log("finished",this.finishedTraining);
      if (this.finishedTraining) {
        //this.$router.push({ name: "Post" });
      }
      console.log("reserved:",this.reservedTrainings);
      
      
    } catch (e) {
      console.error("トレーニングの取得に失敗しました:", e);
    }
  },
  
  // モーダルを開く

  openModal(training) {
      this.selectedTraining = training;
      this.showModal = true;
    },

  openModal2(training) {
      this.localTrainingId=training.trainingId;
      this.selectedTraining = training;
      this.showModal = true;
      this.postflag=true;
    },

    // モーダルを閉じる
    closeModal() {
      this.showModal = false;
      this.localTrainingId = null;
      localStorage.removeItem("trainingId");
      this.postflag=false;
    },

  },
};
</script>

<style scoped>
/* コンポーネント専用のスタイル */
.ui.card {
  margin-bottom: 20px;
}

/* モーダルウィンドウのスタイル */
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

.ui.modal .header {
  font-size: 1.5em;
  font-weight: bold;
}

.ui.modal .content {
  font-size: 1.2em;
  margin-top: 10px;
}

.ui.modal .actions {
  text-align: right;
  margin-top: 20px;
}
</style>