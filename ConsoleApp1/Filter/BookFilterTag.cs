using System.Collections.Generic;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterTag : BookFilterDecorator {
    private readonly List<int> _tags;

    public BookFilterTag(AbstractBookFilter filter, List<int> tags) : base(filter) {
      _tags = tags;
    }

    public override bool Match(Book book) {
      bool m = book.Tags.Intersect(_tags).Count() == _tags.Count;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
