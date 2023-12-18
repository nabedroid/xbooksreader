using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

namespace Nabedroid.XBooksReader.Common {

  public class FileUtil {

    /// <summary>
    /// 画像ファイルの拡張一覧
    /// </summary>
    public static readonly string[] DefaultImageExtensions = new string[] { "jpg", "jpeg", "png", "gif", "tiff", "bmp", "webp" };

    /// <summary>
    /// コンストラクタは秘匿
    /// </summary>
    private FileUtil() {
      // 謝って呼び出されたら例外スロー
      throw new NotSupportedException();
    }

    /// <summary>
    /// ディレクトリ内に存在するファイル一覧を取得する
    /// </summary>
    /// <param name="path">検索するディレクトリパス</param>
    /// <param name="extensions">検索対象の拡張子の配列（.は不要また指定しない場合は全検索）</param>
    /// <returns>ディレクトリ内に存在するファイルのパスのリスト</returns>
    public static List<string> GetDirectoryFiles(string path, string[] extensions = null) {
      List<string> result = new List<string>();
      string[] filePaths = Directory.GetFiles(path, "*.*");
      Func<string, bool> isTargetExtension = (string filePath) => true;
      if (extensions != null) {
        isTargetExtension = (string filePath) => extensions.Contains(filePath.Split('.').Last().ToLower());
      }
      foreach (string filePath in filePaths) {
        if (isTargetExtension(filePath)) {
          result.Add(filePath);
        }
      }
      return result;
    }

    /// <summary>
    /// ディレクトリ内に存在する画像ファイルのパスを取得する 
    /// </summary>
    /// <param name="path">検索するディレクトリパス</param>
    /// <returns>ディレクトリ内に存在する画像ファイルパスのリスト</returns>
    public static List<string> GetDirectoryImageFiles(string path) {
      return GetDirectoryFiles(path, DefaultImageExtensions);
    }

    /// <summary>
    /// 検索対象のディレクトリ内に画像ファイルが存在するか判定する
    /// </summary>
    /// <param name="dirPath">検索対象のディレクトリパス</param>
    /// <returns>存在有無のbool値</returns>
    public static bool IsImageDirectory(string dirPath) {
      // ディレクトリのファイルをすべて取得
      IEnumerable<string> files = Directory.EnumerateFiles(dirPath);
      // 各ファイルの拡張子が画像ファイルのものか判定
      foreach (string filePath in files) {
        //if (DefaultImageExtensions.Any(extension => filePath.ToLower().EndsWith(extension))) return true;
        foreach (string extension in DefaultImageExtensions) {
          if (filePath.ToLower().EndsWith(extension)) {
            return true;
          }
        }
      }

      return false;
    }

    /// <summary>
    /// path配下（サブディレクトリも含む）から画像ファイルを保持するディレクトリパスを取得する
    /// </summary>
    /// <param name="path">走査するディレクトリパス</param>
    /// <param name="max">取得するディレクトリパスの最大件数</param>
    /// <returns>ディレクトリパスのリスト</returns>
    public static List<string> GetImageDirectoryPath(string searchDirPath, int max = int.MaxValue) {
      List<string> paths = new List<string>();

      // path 配下のサブディレクトリも含めたディレクトリを全て取得
      IEnumerable<string> directories = Directory.EnumerateDirectories(searchDirPath, "*", SearchOption.AllDirectories);
      // 各ディレクトリが画像ファイルを含んでいるならリストに追加する
      foreach (string dirPath in directories) {
        // 規定量検索したら終了する
        if (paths.Count >= max) break;
        // ディレクトリのファイルをすべて取得
        if (IsImageDirectory(dirPath)) {
          paths.Add(dirPath);
        }
      }

      return paths;
    }

  }

}
