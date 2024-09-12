exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  //TODO: 任意の変数に、リクエストボディをJavaScriptオブジェクトに変換した上で代入してください。
  const body=JSON.parse(event.body);
    //バリデーション
  if (!body){
    response.statusCode=400;
    response.body=JSON.stringify({
      message: "Invalid request. Body is not set."
    })
    return response;
  }
  response.body=JSON.stringify(body);
  //TODO: responseオブジェクトのbodyプロパティに↑の変数を文字列に変換した上で代入してください
  
  return response;
};
