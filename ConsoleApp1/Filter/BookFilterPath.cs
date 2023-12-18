using System;

namespace Nabedroid.XBooksReader.Common {
  public class BookFilterPath : BookFilterDecorator {
    private readonly Func<Book, bool> _match;
    private readonly string _path;

    /// <summary>
    /// コンストラクタ
    /// </summary>
    /// <param name="filter">フィルター</param>
    /// <param name="path">検索対象の本のディレクトリパス</param>
    /// <param name="isExact">完全一致フラグ（デフォルトはfalse=部分一致）</param>
    public BookFilterPath(AbstractBookFilter filter, string path, bool isExact = false) : base(filter) {
      _path = path;
      if (isExact) {
        _match = ExactMatch;
      } else {
        _match = PartMatch;
      }
    }

    public override bool Match(Book book) {
      bool m = _match(book);
      return m == GetEndValue() ? m : _filter.Match(book);
    }

    private bool ExactMatch(Book book) {
      return book.Path == _path;
    }

    private bool PartMatch(Book book) {
      return book.Path.IndexOf(_path) >= 0;
    }
  }
}
