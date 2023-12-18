using System.ComponentModel;

namespace WindowsFormsApp1.Model {
  public interface ITreeNodeObservableItem : INotifyPropertyChanged {
    string Key { get; }
    string SortKey { get; }
    string Text { get; }
  }
}
