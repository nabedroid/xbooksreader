namespace Nabedroid.XBooksReader.Common {
  public class FactoryFor7z : AbstractFactory {

    private string _7zPath;
    private AbstractBookImageFactory _bookImageFactory;
    private AbstractFilePathListFactory _filePathListFactory;

    public FactoryFor7z(string sevenZipPath) {
      _7zPath = sevenZipPath;
      _bookImageFactory = new BookImageFactoryFor7z(sevenZipPath);
      _filePathListFactory = new FilePathListFactoryFor7z(sevenZipPath);
    }

    public override AbstractBookImageFactory BookImageFactory { 
      get {
        return _bookImageFactory;
      }
    }

    public override AbstractFilePathListFactory FilePathListFactory {
      get {
        return _filePathListFactory;
      }
    }
  }
}
