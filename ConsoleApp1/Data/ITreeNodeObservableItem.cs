using System.ComponentModel;

namespace Nabedroid.XBooksReader.Common {
  public interface ITreeNodeObservableItem : INotifyPropertyChanged {
    string Key { get; }
    string SortKey { get; }
    string Text { get; }
  }
}
