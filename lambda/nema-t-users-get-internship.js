const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
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

  //TODO: 取得対象のテーブル名をparamに宣言
  const param = {TableName};

  const command = new ScanCommand(param);

  try {
    // client.send()で全件取得するコマンドを実行
    const users = (await client.send(command)).Items;
    
    if(!users){
      response.statusCode=404;
      response.body=JSON.stringify({
        message:"user not found."
      })
    }
    //TODO: 全ユーザのpasswordを隠蔽する処理を記述
    users?.forEach((val,index,arr)=>{
      delete val.passward;
    });
    const unmarshalledUsersItems=users.map((item)=>unmarshall(item));
    response.body=JSON.stringify({users:unmarshalledUsersItems});
    //TODO: レスポンスボディを設定する
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
