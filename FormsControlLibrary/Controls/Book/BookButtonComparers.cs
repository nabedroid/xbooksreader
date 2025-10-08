using System.Collections.Generic;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  /// <summary>
  /// BookButtonの比較クラス
  /// </summary>
  public abstract class BookButtonComparer : IComparer<BookButton> {

    public abstract int Compare(BookButton x, BookButton y);

  }

  /// <summary>
  /// BookButtonの比較クラス
  /// ConcreteComponent
  /// </summary>
  public class BookButtonComparerId : BookButtonComparer {

    public override int Compare(BookButton x, BookButton y) {
      return x.Book.Id - y.Book.Id;
    }

  }

  /// <summary>
  /// BookButtonのデコレータ抽象クラス
  /// </summary>
  public abstract class BookButtonComparerDecrator : BookButtonComparer {

    protected BookButtonComparer _comparer;

    public BookButtonComparerDecrator(BookButtonComparer comparer) {
      _comparer = comparer ?? new BookButtonComparerId();
    }

  }

  /// <summary>
  /// BookButtonの降順クラス
  /// </summary>
  public class BookButtonComparerDesc : BookButtonComparerDecrator {

    public BookButtonComparerDesc(BookButtonComparer comparer) : base(comparer) { }

    public override int Compare(BookButton x, BookButton y) {
      return _comparer.Compare(y, x);
    }

  }

  /// <summary>
  /// BookButtonの評価比較クラス
  /// </summary>
  public class BookButtonComparerEvalution : BookButtonComparerDecrator {

    public BookButtonComparerEvalution(BookButtonComparer comparer = null) : base(comparer) { }

    public override int Compare(BookButton x, BookButton y) {
      int result = x.Book.Evalution - y.Book.Evalution;
      if (result == 0) { 
        result = _comparer.Compare(x, y);
      }
      return result;
    }

  }

}
