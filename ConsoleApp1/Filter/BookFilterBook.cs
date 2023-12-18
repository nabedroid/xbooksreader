namespace Nabedroid.XBooksReader.Common {
  internal class BookFilterBook : BookFilterDecorator {
    private readonly int _bookId;

    public BookFilterBook(AbstractBookFilter filter, int bookId) : base(filter) {
      _bookId = bookId;
    }

    public override bool Match(Book book) {
      bool m = book.Id == _bookId;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
