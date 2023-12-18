using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace WindowsFormsApp1.Model {

  public class Character : ITreeNodeObservableItem {

    public event PropertyChangedEventHandler PropertyChanged;

    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    private string _id;
    private string _name;
    private string _description;

    public string Id {
      get { return _id; }
      set {
        _id = value;
        NotifyPropertyChanged();
      }
    }

    public string Name {
      get { return _name; }
      set {
        _name = value;
        NotifyPropertyChanged();
      }
    }

    public string Description {
      get { return _description; }
      set {
        _description = value;
        NotifyPropertyChanged();
      }
    }

    string ITreeNodeObservableItem.Key { get { return _id; } }
    string ITreeNodeObservableItem.Text { get { return $"{_name} {_id} {_description}"; } }
    string ITreeNodeObservableItem.SortKey { get { return _name; } }

  }
}
