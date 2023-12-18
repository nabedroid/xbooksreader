using System;

namespace Nabedroid.XBooksReader.Common {
  public abstract class BookFilterDecorator : AbstractBookFilter {
    protected AbstractBookFilter _filter;

    public BookFilterDecorator(AbstractBookFilter filter) {
      _filter = filter;
    }

    public abstract override bool Match(Book book);

    public override bool GetEndValue() {
      return _filter.GetEndValue();
    }

  }
}
