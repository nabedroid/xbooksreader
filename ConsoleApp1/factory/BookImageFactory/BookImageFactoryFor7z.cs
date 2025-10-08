using ImageProcessor;
using SharpCompress.Archives;
using SharpCompress.Archives.SevenZip;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// 7zファイルから画像ファイルを読み込み画像ファイルを生成するクラス
  /// </summary>
  public class BookImageFactoryFor7z : AbstractBookImageFactory {

    private string _7zPath;

    public BookImageFactoryFor7z(string sevenZipPath) : base() {
      _7zPath = sevenZipPath;
    }

    /// <summary>
    /// 7zファイル内に存在する画像ファイルの相対パスのリストを取得する
    /// </summary>
    /// <returns>画像ファイルの相対パスのリスト</returns>
    public override List<string> GetImagePathList() {
      return new FilePathListFactoryFor7z(_7zPath).GetImageFiles();
    }

    /// <summary>
    /// 7zファイルから相対パスに対応する画像ファイルを生成する
    /// </summary>
    /// <param name="key">相対パス</param>
    /// <returns>画像ファイル</returns>
    public override Image GetImage(string key) {

      Image image = null;
      // 7zファイルを読み込む
      using (Stream stream = File.OpenRead(_7zPath))
      using (IArchive archive = SevenZipArchive.Open(stream)) {
        // key に一致するファイルを走査する
        foreach (IArchiveEntry entry in archive.Entries) {
          if (entry.Key == key) {
            using (Stream entryStream = entry.OpenEntryStream()) {
              // Zipファイル内の画像ファイルを読み込む
              image = ImageFactory.Load(entryStream).Image;
            }
            break;
          }
        }
        // 見つからなかった場合は例外投げる
        if (image == null) {
          throw new FileNotFoundException();
        }
      }
      return image;
    }

    /// <summary>
    /// 7zファイルから相対パスに対応する画像ファイルを非同期で生成する
    /// </summary>
    /// <param name="key">相対パス</param>
    /// <param name="token">キャンセルトークン</param>
    /// <param name="bufferSize">メモリに読み込むバッファサイズ</param>
    /// <returns>Task(画像ファイル)</returns>
    public override Task<Image> GetImageAsync(string key, CancellationToken token, int bufferSize = 1024) {
      return Task.Run(async () => {
        Image image = null;
        // Zip内の該当ファイルを読み込む
        using (Stream stream = File.OpenRead(_7zPath))
        using (IArchive archive = SevenZipArchive.Open(stream)) {
          // key に一致するファイルを走査
          foreach (IArchiveEntry entry in archive.Entries) {
            if (entry.Key == key) {
              // 7z内の該当ファイルをバイト配列として順次読み込み
              using (Stream entryStream = entry.OpenEntryStream()) {
                using (MemoryStream memoryStream = new MemoryStream()) {
                  // 一旦メモリ上に読み込む
                  await entryStream.CopyToAsync(memoryStream, bufferSize, token);
                  // メモリに読み込んだデータをバイト配列に変換して画像を生成
                  image = ImageFactory.Load(memoryStream.ToArray()).Image;
                }
              }
              break;
            }
          }
          // key に一致するファイルが見つからなかった場合は例外投げる
          if (image == null) {
            throw new FileNotFoundException();
          }
        }
        return image;
      }, token);
    }

  }

}