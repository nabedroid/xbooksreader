using System;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterViewDate : BookFilterDecorator {
    private readonly DateTimeOffset _min;
    private readonly DateTimeOffset _max;

    public BookFilterViewDate(AbstractBookFilter filter, DateTimeOffset? min = null, DateTimeOffset? max = null) : base(filter) {
      _min = min ?? DateTimeOffset.MinValue;
      _max = max ?? DateTimeOffset.MaxValue;
    }

    public override bool Match(Book book) {
      bool m = _min <= book.ViewDate && book.ViewDate <= _max;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
