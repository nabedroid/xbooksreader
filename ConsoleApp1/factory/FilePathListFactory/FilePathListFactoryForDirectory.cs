using System.Collections.Generic;
using System.IO;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// ディレクトリ内のファイル一覧を取得するクラス
  /// </summary>
  public class FilePathListFactoryForDirectory : AbstractFilePathListFactory {

    private string _directoryPath;

    public FilePathListFactoryForDirectory(string directoryPath) : base() {
      _directoryPath = directoryPath;
    }

    /// <summary>
    /// ディレクトリ内のファイルのパスを逐次応答する
    /// </summary>
    /// <returns></returns>
    public override IEnumerable<string> GetFilePaths() {
      return Directory.EnumerateFiles(_directoryPath);
    }
  }
}
