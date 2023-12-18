using System.Collections.Generic;
using System.Linq;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterCharacter : BookFilterDecorator {
    private readonly List<int> _characters;

    public BookFilterCharacter(AbstractBookFilter filter, List<int> characters) : base(filter) {
      _characters = characters;
    }

    public override bool Match(Book book) {
      bool m = book.Characters.Intersect(_characters).Count() == _characters.Count;
      return m == GetEndValue() ? m : _filter.Match(book);
    }
  }
}
