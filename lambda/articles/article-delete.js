const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Article";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  const {userId,timestamp}=JSON.parse(event.body);
  
  const token = event.headers?.authorization;

  // トークンの存在確認（ここでは簡単なチェックを実施）
  if (!token) {
    response.statusCode = 401; // Unauthorized
    response.body = JSON.stringify({
      message: "Unauthorized: Token is missing."
    });
    return response;
  }
  //バリデーション
  if (!userId){
    response.statusCode=400;
    response.body=JSON.stringify({
      message: "Invalid request. userId is not set."
    })
    return response;
  }
    if (!timestamp){
    response.statusCode=400;
    response.body=JSON.stringify({
      message: "timestamp not found."
    })
    return response;
  }
  // TODO: 削除対象のテーブル名と削除したいデータのkeyをparamに設定
  const param = {
    TableName,
    Key: {
      userId: { S: userId }, // パーティションキー
      timestamp: { N: timestamp.toString() } // ソートキー
    }
  };

  // データを削除するコマンドを用意
  const command = new DeleteItemCommand(param);
  // response.body=JSON.stringify((param));
  // return response;
  try {
    // client.send()を用いてデータを削除するコマンドを実行
    await client.send(command);
    // TODO: 成功後の処理を記載(status codeを指定する。)
    response.statusCode=204;
    response.body = JSON.stringify({ message: "204 No Content." });
    return response;
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
