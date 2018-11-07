function doPost(e){
try{
  //デバッグのとき
  if (typeof e === "undefined"){
    var url = "http://blog.re-presentation.jp/wp-content/uploads/2016/01/WS001349-1024x576.jpg" 
    Logger.log("[DEBUG] END POINT: %s", url) 
  } else {  
      Logger.log("[INFO] POSTリクエストが呼び出されました")
      var json = JSON.parse(e.postData.contents);
      var reply_token= json.events[0].replyToken;
      var messageId = json.events[0].message.id; //送られたメッセージのID
      var url = 'https://api.line.me/v2/bot/message/'+ messageId +'/content/' //バイナリファイルの画像が取得できるエンドポイント
      Logger.log("LINE END POINT FOUND: %s", url) 
  }
  //LINEから画像を受け取って、base64形式で取得したblobファイルを返す
  var imageResponse = getImageResponse(url);
  var blobBase64 = Utilities.base64Encode(imageResponse.getContent())
  
  //blobファイルを、Google Vision APIにかませて、テキストを取得する
  var text = getText(blobBase64)
  
  //取得した画像に文字が含まれていない場合、もしくはエラーが起こった場合
  if (typeof text === "undefined"){
    text = "画像から文字を検出できませんでした。"
  }
  
  //Lineにテキストファイルを返す
  postLine(text, reply_token);
} catch (e){
  Logger.log("Failed: %s", e)
  text = "ちょっと休憩させてーーーーーーーー  "
  ;
  doc.getBody().appendParagraph(Logger.getLog()) 
}
doc.getBody().appendParagraph(Logger.getLog())  
}  