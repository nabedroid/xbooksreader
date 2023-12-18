using System;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterCreateDate : BookFilterDecorator {
    private readonly DateTimeOffset _min;
    private readonly DateTimeOffset _max;

    public BookFilterCreateDate(AbstractBookFilter filter, DateTimeOffset? min = null, DateTimeOffset? max = null) : base(filter) {
      _min = min ?? DateTimeOffset.MinValue;
      _max = max ?? DateTimeOffset.MaxValue;
    }

    public override bool Match(Book book) {
      bool m = _min <= book.CreateDate && book.CreateDate <= _max;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
