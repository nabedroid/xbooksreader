using ImageProcessor;
using SharpCompress.Readers;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// アーカイブファイルから画像ファイルを読み込み画像ファイルを生成するクラス
  /// </summary>
  public class BookImageFactoryForArchive : AbstractBookImageFactory {

    private string _archivePath;

    public BookImageFactoryForArchive(string archivePath) : base() {
      _archivePath = archivePath;
    }

    /// <summary>
    /// アーカイブファイル内に存在する画像ファイルの相対パスのリストを取得する
    /// </summary>
    /// <returns>画像ファイルの相対パスのリスト</returns>
    public override List<string> GetImagePathList() {
      return new FilePathListFactoryForArchive(_archivePath).GetImageFiles();
    }

    /// <summary>
    /// アーカイブファイルから相対パスに対応する画像ファイルを生成する
    /// </summary>
    /// <param name="key">相対パス</param>
    /// <returns>画像ファイル</returns>
    public override Image GetImage(string key) {

      Image image = null;
      // Zipファイルを読み込む
      using (Stream stream = File.OpenRead(_archivePath))
      using (IReader reader = ReaderFactory.Open(stream)) {
        // key に一致するファイルを走査する
        while (reader.MoveToNextEntry()) {
          if (reader.Entry.Key == key) {
            // Zipファイル内の画像ファイルを読み込む
            using (Stream entryStream = reader.OpenEntryStream()) {
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
    /// アーカイブファイルから相対パスに対応する画像ファイルを非同期で生成する
    /// </summary>
    /// <param name="key">相対パス</param>
    /// <param name="token">キャンセルトークン</param>
    /// <param name="bufferSize">メモリに読み込むバッファサイズ</param>
    /// <returns>Task(画像ファイル)</returns>
    public override Task<Image> GetImageAsync(string key, CancellationToken token, int bufferSize = 1024) {
      return Task.Run(async () => {
        Image image = null;
        // Zip内の該当ファイルを読み込む
        using (Stream stream = File.OpenRead(_archivePath))
        using (IReader reader = ReaderFactory.Open(stream)) {
          // key に一致するファイルを走査
          while (reader.MoveToNextEntry()) {
            if (reader.Entry.Key == key) {
              // Zip内の該当ファイルをバイト配列として順次読み込み
              using (Stream entryStream = reader.OpenEntryStream()) {
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