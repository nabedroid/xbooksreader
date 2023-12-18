using System.Collections.Generic;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterCircle : BookFilterDecorator {
    private readonly List<int> _circles;

    public BookFilterCircle(AbstractBookFilter filter, List<int> circles) : base(filter) {
      _circles = circles;
    }

    public override bool Match(Book book) {
      bool m = book.Circles.Intersect(_circles).Count() == _circles.Count;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
