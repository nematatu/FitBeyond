<template>
  <Menu />
  <div class="ui main container">
    <h1>Community</h1>
    <div v-if="posts.length === 0" class="ui message">
      <p>投稿がありません。</p>
    </div>
    <ul class="ui column">
      <template v-for="(post, index) in posts" :key="index">
        <li class="column" style="list-style-type: none">
          <div class="ui card fluid">
            <div class="content">
              <!-- <div class="image">
                  <img
                    src="../../public/女性アイコン素材.jpeg"
                    alt="user-icon"
                  />
                </div> 
                  <div class="header">
                    {{ post.title || "タイトルがありません" }}
                  </div> -->
              <h3 v-if ="post.title" class="ui header">{{post.title}}</h3>
              <h4 class="ui header">
                <img
                  src="../../public/女性アイコン素材.jpeg"
                  class="ui circular image"
                />
                <div class="content">
                <div >
                {{ post.username }}
                </div>
                <div class="timestamp">
                投稿日時:
                {{
                  post.timestamp
                    ? new Date(post.timestamp).toLocaleString()
                    : "タイムスタンプがありません"
                }}
                </div>
              </div>
              </h4>

              <div class="description">
                {{ post.text || "テキストがありません" }}<br />
                
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Menu from "@/components/Menu.vue";
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Community",
  components: {
    Menu,
  },
  data() {
    return {
      posts: [], // APIから取得した投稿
    };
  },
  async created() {
    await this.fetchPosts(); // コンポーネント作成時にAPIを呼び出して投稿を取得
  },
  methods: {
    // 投稿を取得し、ユーザー情報を取得してusernameを付与する
    async fetchPosts() {
      try {
        const response = await fetch(`${baseUrl}/fit/article`, {
          method: "GET",
        });
        const data = await response.json();
        this.posts = data.posts; // APIレスポンスの"posts"フィールドに投稿データが格納されていると仮定

        // 各投稿に対応するusernameを取得してpostsに追加
        for (let post of this.posts) {
          const fetchURL = `${baseUrl}/fit/user?email=${post.email}`;
          if (post.email) {
            const userResponse = await fetch(fetchURL, {
              method: "GET",
            });
            const userData = await userResponse.json();
            post.username = userData.username || "Unknown"; // usernameが存在しない場合はUnknownをセット
          } else {
            post.username = "Unknown"; // emailがない場合もUnknownをセット
          }
        }
      } catch (error) {
        console.error("投稿の取得に失敗しました:", error);
      }
    },
  },
};
</script>

<style scoped>
/* imageクラスでアイコンを丸くしてサイズを小さく調整 */
.image img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin-right: 20px;
}

/* 投稿リストのデザイン */
.ui.relaxed.divided.list {
  margin-top: 20px;
}

.ui.relaxed.divided.list .item {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center; /* アイコンとコンテンツを中央揃えにする */
}

.ui.relaxed.divided.list .header {
  font-size: 1.4em;
  color: #333;
}

.ui.relaxed.divided.list .meta {
  font-size: 1em;
  color: #777;
}

.ui.relaxed.divided.list .description {
  margin-top: 10px;
  font-size: 1.2em;
  color: #555;
}

.ui.main.container {
  margin-top: 50px;
  max-width: 800px;
}

.ui.card {
  margin-bottom: 20px;
}

.description{
  margin-left: 30px;
}
.timestamp{
  size: 10px
}
</style>
