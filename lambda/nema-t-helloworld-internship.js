exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  };
  
  console.log("hello world!!!testだよ〜");
  
    //レスポンスボディにJSON形式の文字列を代入
  response.body = JSON.stringify({ message: "Hello World!" });
  
  const name=event.queryStringParameters.name;
  const place=event.queryStringParameters.place;
  
  
  console.log(response.body);
  
  return response;
};
