using System.Collections.Generic;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterOriginal : BookFilterDecorator {
    private readonly List<int> _originals;

    public BookFilterOriginal(AbstractBookFilter filter, List<int> originals) : base(filter) {
      _originals = originals;
    }

    public override bool Match(Book book) {
      bool m = book.Originals.Intersect(_originals).Count() == _originals.Count;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
