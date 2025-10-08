namespace Nabedroid.XBooksReader.Common {
  /// <summary>
  /// BookImageFactoryおよびFileListFactoryを管理するFactory抽象クラス
  /// </summary>
  public abstract class AbstractFactory {
    public abstract AbstractBookImageFactory BookImageFactory { get; }
    public abstract AbstractFilePathListFactory FilePathListFactory { get; }
  }
}
