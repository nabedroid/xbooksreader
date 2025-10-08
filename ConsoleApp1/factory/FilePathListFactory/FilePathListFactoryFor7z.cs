using SharpCompress.Archives.SevenZip;
using System.Collections.Generic;
using System.IO;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// 7z内のファイル一覧を取得するクラス
  /// </summary>
  public class FilePathListFactoryFor7z : AbstractFilePathListFactory {

    private string _7zPath;

    public FilePathListFactoryFor7z(string sevenZipPath) : base() {
      _7zPath = sevenZipPath;
    }

    /// <summary>
    /// 7z内のファイルのパスを逐次応答する
    /// </summary>
    /// <returns></returns>
    public override IEnumerable<string> GetFilePaths() {
      using (Stream stream = File.OpenRead(_7zPath))
      using (SevenZipArchive archive = SevenZipArchive.Open(stream)) {
        foreach (SevenZipArchiveEntry entry in archive.Entries) {
          if (entry.IsDirectory) continue;
          yield return entry.Key;
        }
      }
    }
  }
}
