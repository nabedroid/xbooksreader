using System;
using System.Diagnostics;
using System.IO;
using System.Text.Json;

namespace ConsoleApp1 {
  public class XBookDataIO {
    // 読み書きするJsonの形式を設定
    private static JsonSerializerOptions _serializerOptions = new JsonSerializerOptions {
      WriteIndented = true,
      // キー名はキャメル形式
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public static XBooksData Read(string path) {
      XBooksData data = new XBooksData();

      // 引数の妥当性チェック
      if (path == null || File.Exists(path) == false) {
        return null;
      }

      // ファイルを読み込み XBookData 型に変換する
      try {
        // テキストファイルとして読み込む
        string jsonString = File.ReadAllText(path);
        // XBooksDataJsonとして読み込む
        data = JsonSerializer.Deserialize<XBooksData>(jsonString, _serializerOptions);
      } catch (JsonException ex) {
        // ファイルフォーマットが不正な場合
        Debug.WriteLine(ex.Message);
        return null;
      }

      return data;
    }

    public static Boolean Write(XBooksData data, string path) {
      Boolean result = false;

      string jsonString = JsonSerializer.Serialize(data);
      try {
        File.WriteAllText(path, jsonString);
        result = true;
      } catch (IOException ex) {
        Console.WriteLine(ex.Message);
      }

      return result;
    }
  }
}
