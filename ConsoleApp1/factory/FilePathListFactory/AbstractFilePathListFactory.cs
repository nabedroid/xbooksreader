using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {

  /// <summary>
  /// データ内に含まれるファイル一覧を取得する抽象クラス
  /// </summary>
  public abstract class AbstractFilePathListFactory {

    protected AbstractFilePathListFactory() { }

    /// <summary>
    /// 含まれるファイルのパスを逐次応答する
    /// </summary>
    /// <returns></returns>
    public abstract IEnumerable<string> GetFilePaths();

    /// <summary>
    /// 含まれる全ファイルのパスを取得する
    /// </summary>
    /// <returns></returns>
    public virtual List<string> GetFilePathList() {
      List<string> filePathList = new List<string>();
      foreach (string filePath in GetFilePaths()) {
        filePathList.Add(filePath);
      }
      filePathList.Sort(WindowsStringComparer.Windows);
      return filePathList;
    }

    /// <summary>
    /// 含まれる画像ファイルのパスを取得する
    /// </summary>
    /// <returns></returns>
    public virtual List<string> GetImageFiles() {
      List<string> filePathList = new List<string>();
      foreach (string filePath in GetFilePaths()) {
        string extension = Path.GetExtension(filePath).ToLower();
        if (Constants.ImageExtensions.Contains(extension)) {
          filePathList.Add(filePath);
        }
      }
      filePathList.Sort(WindowsStringComparer.Windows);
      return filePathList;
    }

    /// <summary>
    /// データ内に画像ファイルが含まれているか判定する
    /// </summary>
    /// <returns></returns>
    public virtual bool ContainsImageFile() {
      foreach (string filePath in GetFilePaths()) {
        string extension = Path.GetExtension(filePath).ToLower();
        if (Constants.ImageExtensions.Contains(extension)) {
          return true;
        }
      }
      return false;
    }

  }

}
