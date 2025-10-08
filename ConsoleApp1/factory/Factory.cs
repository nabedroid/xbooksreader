using System;
using System.IO;

namespace Nabedroid.XBooksReader.Common {
  /// <summary>
  /// データの種類に応じて Factory を自動判別するクラス
  /// </summary>
  public class Factory : AbstractFactory {

    private string _dataPath;
    private AbstractFactory _factory;

    public Factory(string dataPath) {
      _dataPath = dataPath;
      // データの種類を判定
      if (Directory.Exists(_dataPath)) {
        // ディレクトリ
        _factory = new FactoryForDirectory(dataPath);
      } else if (File.Exists(_dataPath)) {
        string dataPathLower = dataPath.ToLower();
        if (dataPathLower.EndsWith(".zip")) {
          // zip
          _factory = new FactoryForArchive(dataPath);
        } else if (dataPathLower.EndsWith(".7z")) {
          // 7z
          _factory = new FactoryFor7z(dataPath);
        } else if (dataPathLower.EndsWith(".tar")) {
          // tar
          _factory = new FactoryForArchive(dataPath);
        } else if (dataPathLower.EndsWith(".rar")) {
          // rar
          _factory = new FactoryForArchive(dataPath);
        } else if (dataPathLower.EndsWith(".tar.bz2")) {
          // tarbz2
          _factory = new FactoryForArchive(dataPath);
        } else {
          // サポート外の拡張子
          throw new ArgumentException();
        }
      } else {
        // ファイルが見つからない
        throw new FileNotFoundException();
      }
    }

    public override AbstractBookImageFactory BookImageFactory {
      get {
        return _factory.BookImageFactory;
      }
    }

    public override AbstractFilePathListFactory FilePathListFactory {
      get {
        return _factory.FilePathListFactory;
      }
    }

  }

}
