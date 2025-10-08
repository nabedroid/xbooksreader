namespace Nabedroid.XBooksReader.Common {
  public class FactoryForDirectory : AbstractFactory {

    private string _directoryPath;
    private AbstractBookImageFactory _bookImageFactory;
    private AbstractFilePathListFactory _filePathListFactory;

    public FactoryForDirectory(string directoryPath) {
      _directoryPath = directoryPath;
      _bookImageFactory = new BookImageFactoryForDirectory(directoryPath);
      _filePathListFactory = new FilePathListFactoryForDirectory(directoryPath);
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
