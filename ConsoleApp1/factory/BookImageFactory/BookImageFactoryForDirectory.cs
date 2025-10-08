using ImageProcessor;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {

  public class BookImageFactoryForDirectory : AbstractBookImageFactory {

    private string _directoryPath;

    public BookImageFactoryForDirectory(string directoryPath) : base() {
      _directoryPath = directoryPath;
    }

    /// <summary>
    /// ディレクトリ内に存在する画像ファイルのファイルパスのリストを取得する
    /// </summary>
    /// <returns>フォルダ内の画像ファイルのファイルパスのリスト</returns>
    public override List<string> GetImagePathList() {
      return new FilePathListFactoryForDirectory(_directoryPath).GetImageFiles();
    }

    /// <summary>
    /// 画像ファイルを読み込む
    /// </summary>
    /// <param name="imageFilePath">画像ファイルのフルパス</param>
    /// <returns>画像ファイル</returns>
    public override Image GetImage(string imageFilePath) {

      Image image = ImageFactory.Load(imageFilePath).Image;

      return image;
    }

    /// <summary>
    /// 非同期で画像ファイルを読み込む
    /// </summary>
    /// <param name="imageFilePath">画像ファイルのフルパス</param>
    /// <param name="token">キャンセルトークン</param>
    /// <param name="bufferSize">メモリ読み込み時のバッファサイズ</param>
    /// <returns>画像ファイル</returns>
    public override Task<Image> GetImageAsync(string imageFilePath, CancellationToken token, int bufferSize = 1024) {
      return Task.Run(async () => {
        Image image = null;
        // TODO: ファイルロックされるか確認
        // 画像ファイルの読み取りStreamを取得
        using (Stream stream = File.OpenRead(imageFilePath)) {
          // 一旦メモリに読み込んだ後にバイト配列に変換して画像ファイルを生成
          using (MemoryStream memoryStream = new MemoryStream()) {
            // メモリに読み込む
            await stream.CopyToAsync(memoryStream, bufferSize, token);
            // 読み込んだデータをバイト配列に変換して画像ファイルを生成
            image = ImageFactory.Load(memoryStream.ToArray()).Image;
          }
        }
        return image;
      }, token);
    }

  }

}