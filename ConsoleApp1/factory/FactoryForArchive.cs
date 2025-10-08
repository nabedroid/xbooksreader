namespace Nabedroid.XBooksReader.Common {
  public class FactoryForArchive : AbstractFactory {

    private string _archivePath;
    private AbstractBookImageFactory _bookImageFactory;
    private AbstractFilePathListFactory _filePathListFactory;

    public FactoryForArchive(string archivePath) {
      _archivePath = archivePath;
      _bookImageFactory = new BookImageFactoryForArchive(archivePath);
      _filePathListFactory = new FilePathListFactoryForArchive(archivePath);
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
