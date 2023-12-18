namespace Nabedroid.XBooksReader.Common {
  public class BookFilterFavorite : BookFilterDecorator {
    private readonly bool _favorite;

    public BookFilterFavorite(AbstractBookFilter filter, bool favorite) : base(filter) {
      _favorite = favorite;
    }

    public override bool Match(Book book) {
      bool m = book.Favorite == _favorite;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
