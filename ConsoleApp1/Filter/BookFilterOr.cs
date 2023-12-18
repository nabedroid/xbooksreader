namespace Nabedroid.XBooksReader.Common {
  public class BookFilterOr : AbstractBookFilter {

    public override bool Match(Book book) {
      return false;
    }

    public override bool GetEndValue() {
      return true;
    }
  }
}
