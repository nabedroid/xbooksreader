using System;

namespace Nabedroid.XBooksReader.Common {
  public abstract class AbstractBookFilter {
    public abstract bool Match(Book book);
    public abstract bool GetEndValue();
  }
}

// public void match(book) {
//   if (book.aaa == ~~~) {
//     return true;
//   }
//   return false;
// }

// public void and() {
//   if match == false
//     return false
//   else
//     return child.match();

// public bool or
//   if match == true
//     return true;
//   else
//     return child.match()