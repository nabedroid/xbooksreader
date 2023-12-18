using System.Xml.Schema;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterCount : BookFilterDecorator {
    private readonly int _min;
    private readonly int _max;

    public BookFilterCount(AbstractBookFilter filter, int min = -1, int max = 11) : base(filter) {
      _min = min;
      _max = max;
    }

    public override bool Match(Book book) {
      bool m = _min <= book.Count && book.Count <= _max;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
