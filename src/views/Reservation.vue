<template>
    <div>
      <Menu />
      <div v-if="showModal" class="ui modal active">
        <div class="header">予約確認</div>
        <div class="content">
          <p>以下のトレーニングを予約しますか？</p>
          <h2>{{ selectedTraining.title || "No Title Available" }}</h2>
          <span>トレーナー: {{ selectedTraining.trainerName || "Unknown" }}</span>
          <div class="description">
            {{ selectedTraining.description || "No description available" }}<br />
            カテゴリー: {{ selectedTraining.category || "No category available" }}<br />
            更年期症状: {{ selectedTraining.menoCategory || "No menoCategory available" }}<br />
            開始時刻:
            {{
              selectedTraining.start
                ? new Date(selectedTraining.start ).toLocaleString()
                : "No start time"
            }}<br />
            終了時刻:
            {{
              selectedTraining.end
                ? new Date(selectedTraining.end ).toLocaleString()
                : "No end time"
            }}
          </div>
        </div>
        <div class="actions">
          <button class="ui button" @click="cancelReservation">キャンセル</button>
          <button class="ui button primary" @click="confirmReservation">
            予約する
          </button>
        </div>
      </div>
  
      <div class="ui segment custom-segment">
        <form class="ui form">
          <div class="field">
            <label for="title"><i class="edit outline icon"></i>Title</label>
            <input v-model="title" type="text" name="title" placeholder="Training Title" />
          </div>
  
          <!-- カテゴリーのドロップダウン -->
          <div class="field">
            <label for="category"><i class="tags icon"></i>Category</label>
            <select v-model="category" name="category">
              <option disabled value="">カテゴリーを選択</option>
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
  
          <!-- トレーナー名のドロップダウン -->
          <div class="field">
            <label for="trainerName"><i class="address book icon"></i>Trainer Name</label>
            <select v-model="trainerName" name="trainerName">
              <option disabled value="">トレーナー名を選択</option>
              <option v-for="option in trainerOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
  
          <!-- 更年期症状のドロップダウン -->
          <div class="field">
            <label for="menoCategory">Meno Category</label>
            <select v-model="menoCategory" name="menoCategory">
              <option disabled value="">更年期症状を選択</option>
              <option v-for="option in menoCategoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
  
          <div class="field">
            <i class="calendar check outline icon"></i>
            <label>Search by Date</label>
            <input v-model="searchDate" type="date" name="searchDate" />
          </div>
  
          <div class="field">
            <i class="calendar check icon"></i>
            <label>Select a day</label>
            <div class="ui buttons">
              <template v-for="(day, index) in dateButtons" :key="index">
                <button class="ui button" @click.prevent="searchByButton(day)">
                  {{ day.label }}
                </button>
              </template>
            </div>
          </div>
        </form>
      </div>
  
      <div class="ui main container custom-container">
        <ul class="ui three column grid">
          <template v-for="(item, index) in filteredTrainings" :key="index">
            <li class="column">
              <div class="ui card fluid custom-card" @click="showReservationModal(item)">
                <div class="image">
                  <img src="../../public/default.jpg" alt="Thumbnail" class="card-image"/>
                </div>
                <div class="content">
                  <h2 class="headers custom-header">{{ item.title || "No Title Available" }}</h2>
                  <span class="meta"><i class="address book icon"></i>Trainer: {{ item.trainerName || "Unknown" }}</span>
                  <div class="description">
                    <div class="custom-text">
                    {{ item.description || "No description available" }}<br />
                    <i class="tags icon"></i>Category: {{ item.category || "No category available" }}<br />
                    <i class="calendar check outline icon"></i>Meno Category: {{ item.menoCategory || "No menoCategory available" }}<br />
                    <i class="calendar check icon"></i>
                    Start:
                    {{
                      item.start
                        ? new Date(item.start ).toLocaleString()
                        : "No start time"
                    }}<br />
                    
                    End:
                    {{
                      item.end
                        ? new Date(item.end).toLocaleString()
                        : "No end time"
                    }}
                  </div>
                </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { format } from "date-fns"; // 日付フォーマット用
  import Menu from "@/components/Menu.vue";
  import { baseUrl } from "@/assets/config.js";
  
  export default {
    name: "Reservation",
    components: {
      Menu,
    },
    data() {
      return {
        trainings: [],
        title: "",
        category: "",
        menoCategory: "",
        trainerName: "",
        searchDate: "", // 検索用の日付
        selectedTraining: null, // 選択されたトレーニング
        showModal: false, // モーダル表示のフラグ
        dateButtons: [], // 日にちボタンのリスト
  
        // カテゴリーとトレーナーのドロップダウンに必要なデータ
        categoryOptions: ["選択しない" ,"ヨガ", "ピラティス", "筋力トレーニング", "有酸素運動", "ストレッチ"],
  
        trainerOptions: ["選択しない", "イモと", "メイウェザー", "やすこ", "ふわちゃん"],
        
        // 更年期カテゴリー用のオプション
        menoCategoryOptions: ["選択しない", "ホットフラッシュ", "疲労", "気分の変動", "不眠症"],
      };
    },
  
    computed: {
      filteredTrainings() {
        const selectedDateStart = this.searchDate
          ? new Date(this.searchDate).setHours(0, 0, 0, 0)
          : 0;
  
        const selectedDateEnd = this.searchDate
          ? new Date(this.searchDate).setHours(23, 59, 59, 999)
          : 9999999999999;
  
        return this.trainings.filter((e) => {
          const matchTitle = this.title
            ? e.title && e.title.toLowerCase().includes(this.title.toLowerCase())
            : true;
  
          const matchCategory = this.category
            ? this.category == "選択しない" ||
              typeof e.category === "string" &&
              e.category.toLowerCase().includes(this.category.toLowerCase())
            : true;
  
          const matchTrainer = this.trainerName
            ? this.trainerName == "選択しない" ||
              typeof e.trainerName === "string" &&
              e.trainerName.toLowerCase().includes(this.trainerName.toLowerCase())
            : true;
            
          const matchMenoCategory = this.menoCategory
            ? this.menoCategory == "選択しない" ||
              typeof e.menoCategory === "string" &&
              e.menoCategory.toLowerCase().includes(this.menoCategory.toLowerCase())
            : true;
  
          const withinTimeRange =
            (selectedDateStart ? e.start >= selectedDateStart : true) &&
            (selectedDateEnd ? e.end <= selectedDateEnd : true);
  
          return matchTitle && matchCategory && matchTrainer && withinTimeRange && matchMenoCategory;
        });
      },
    },
  
    methods: {
      async fetchTrainings() {
        try {
          const res = await fetch(baseUrl + "/fit/trainings/before", {
            method: "GET",
          });
  
          const jsonData = await res.json();
          console.log("jsonData.Trainings:", jsonData.Trainings);
  
          if (!res.ok) {
            const errorMessage = jsonData.message ?? "error not found";
            throw new Error(errorMessage);
          }
  
          this.trainings = jsonData.Trainings ?? [];
        } catch (e) {
          console.error(e);
        }
      },
  
      // 日にちボタンを押したときの処理
      searchByButton(day) {
        this.searchDate = day.date; // ボタンの日付に基づいて検索
      },
  
      showReservationModal(training) {
        this.selectedTraining = training;
        this.showModal = true; // モーダルを表示
      },
  
      async confirmReservation() {
        const trainingId = this.selectedTraining.trainingId;
        const email = localStorage.getItem("email");
  
        const reqBody = {
          trainingId,
          email,
        };
  
        try {
          const res = await fetch(baseUrl + "/fit/reservation", {
            method: "PUT",
            body: JSON.stringify(reqBody),
          });
          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};
  
          if (!res.ok) {
            const errorMessage = jsonData.message ?? "エラーメッセージがありません";
            throw new Error(errorMessage);
          }
  
          console.log(jsonData);
          this.showModal = false; // モーダルを閉じる
          this.$router.push({ name: "Confirm" });
        } catch (e) {
          console.error(e);
          console.log("予約処理中にエラーが発生しました。");
        }
      },
  
      cancelReservation() {
        this.showModal = false; // モーダルを閉じる
      },
  
      // 一週間分の日にちボタンを作成
      generateDateButtons() {
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          this.dateButtons.push({
            label: format(date, "MM月dd日"),
            date: format(date, "yyyy-MM-dd"),
          });
        }
      },
  
  
    },
  
    created() {
      this.fetchTrainings();
      this.generateDateButtons(); // 日にちボタンを生成
      const token = window.localStorage.getItem("token");
      const emailconf = window.localStorage.getItem("email");
      if (!token) {
        console.log("token not found");
        this.$router.push({ name: "Login" });
      } else if (!emailconf) {
        console.log("email not found");
        this.$router.push({ name: "Login" });
      }
      // 現在の年と月を取得して `searchDate` の初期値を設定
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 月を2桁にフォーマット
      
      const date = String(today.getDate()).padStart(2, '0');
      
      console.log(`${year}-${month}-${date}`);
  
      // 日は入力せず、年と月だけにするために"YYYY-MM"形式にする
      this.searchDate = `${year}-${month}-${date}`;
    },
  };
  </script>
  
  <style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
  
  /* モーダルのスタイル */
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
  
  /* ボタンのレイアウト */
  .ui.buttons {
    display: flex;
    gap: 10px;
  }
  
  /* ボタンのスタイル */
  .ui.button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .ui.button:hover {
    background-color: #45a049;
  }
  
  /* ドロップダウンメニューのスタイル */
  .dropdown {
    position: relative;
    width: 100%;
    margin-top: 5px;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
  }
  
  .dropdown-content {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    width: 100%;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: none; /* 修正: v-show と display: none が競合するため削除 */
  }
  
  .dropdown-item {
    padding: 10px;
    cursor: pointer;
  }
  
  .dropdown-item:hover {
    background-color: #f1f1f1;
  }
  
  /* スクロールバーのカスタマイズ */
  .dropdown-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .dropdown-content::-webkit-scrollbar-thumb {
    background-color: #4caf50;
    border-radius: 10px;
  }
  
  .dropdown-content::-webkit-scrollbar-thumb:hover {
    background-color: #45a049;
  }
  </style>