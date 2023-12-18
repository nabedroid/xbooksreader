using System.Xml.Schema;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterEvalution : BookFilterDecorator {
    private readonly int _min;
    private readonly int _max;

    public BookFilterEvalution(AbstractBookFilter filter, int min = -1, int max = 11) : base(filter) {
      _min = min;
      _max = max;
    }

    public override bool Match(Book book) {
      bool m = _min <= book.Evalution && book.Evalution <= _max;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
