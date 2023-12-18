using System.Collections.Generic;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterWriter : BookFilterDecorator {
    private readonly List<int> _writers;

    public BookFilterWriter(AbstractBookFilter filter, List<int> writers) : base(filter) {
      _writers = writers;
    }

    public override bool Match(Book book) {
      bool m = book.Writers.Intersect(_writers).Count() == _writers.Count;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
