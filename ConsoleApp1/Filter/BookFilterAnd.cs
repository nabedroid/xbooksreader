namespace Nabedroid.XBooksReader.Common {
  public class BookFilterAnd : AbstractBookFilter {

    public override bool Match(Book book) {
      return true;
    }

    public override bool GetEndValue() {
      return false;
    }
  }
}
