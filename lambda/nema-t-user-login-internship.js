const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "User";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const body=event.body?JSON.parse(event.body):null;
  
  //バリデーション
  if (!body || !body.userId ||!body.password){
    response.statusCode=400;
    response.body=JSON.stringify({
      message: "Invalid request. Required parameters are not set in request body."
    })
    return response;
  }
  // TODO: query()に渡すパラムを宣言
  const param = {
    TableName,
    //キー、インデックスによる検索の定義
    KeyConditionExpression: "userId=:uid",
    //プライマリーキー以外の属性でのフィルタ
    FilterExpression: "password=:pkey",
    //検索値のプレースホルダの定義
    ExpressionAttributeValues: marshall({
      ":uid":body.userId,
      ":pkey":body.password,
    }),
  };
  console.log(body);
  // userIdとpasswordが一致するデータを検索するコマンドを用意
  const command = new QueryCommand(param);
  try {
    // client.send()の実行でuserIdとpasswordが一致するデータの検索
    const res = await client.send(command);
    
    //TODO: 該当するデータが見つからない場合の処理を記述(ヒント：resの中には個数のプロパティが入っています。)
    if(res==0){
      throw new Error("do not match pass or Id");
    }
    //TODO: 認証が成功した場合のレスポンスボディを設定する。
    response.body=JSON.stringify({token:"mtiToken"});
    
    
    if(event.headers.authorization!=="mtiToken"){
      response.statusCode=401;
      response.body=JSON.stringify({
        message:"Invalid request header"
      });
      return response;
    }
    
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
