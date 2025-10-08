using SharpCompress.Readers;
using System.Collections.Generic;
using System.IO;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// アーカイブファイル内のファイル一覧を取得するクラス
  /// ※7zは使えないので注意
  /// </summary>
  public class FilePathListFactoryForArchive : AbstractFilePathListFactory {

    private string _archivePath;

    public FilePathListFactoryForArchive(string archivePath) : base() {
      _archivePath = archivePath;
    }

    /// <summary>
    /// ディレクトリ内のファイルのパスを逐次応答する
    /// </summary>
    /// <returns></returns>
    public override IEnumerable<string> GetFilePaths() {
      using (Stream stream = File.OpenRead(_archivePath))
      using (IReader reader = ReaderFactory.Open(stream)) {
        while (reader.MoveToNextEntry()) {
          if (reader.Entry.IsDirectory) continue;
          yield return reader.Entry.Key;
        }
      }
    }
  }
}
