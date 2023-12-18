using System.ComponentModel;
using System.Runtime.CompilerServices;
using System;

namespace Nabedroid.XBooksReader.Common {

  public class SearchPath : INotifyPropertyChanged {

    public event PropertyChangedEventHandler PropertyChanged;

    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    public SearchPath() {
      CreateDate = DateTimeOffset.Now;
    }

    // ID
    private int _id;
    public int Id {
      get { return this._id; }
      set {
        if (this._id != value) {
          this._id = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    // ディレクトリパス
    private string _path;
    public string Path {
      get { return this._path; }
      set {
        if (this._path != value) {
          this._path = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    // 作成日
    private DateTimeOffset _createDate;
    public DateTimeOffset CreateDate {
      get { return this._createDate; }
      set {
        if (this._createDate != value) {
          this._createDate = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    // ディレクトリチェック日
    private DateTimeOffset _searchDate;
    public DateTimeOffset SearchDate {
      get { return this._searchDate; }
      set {
        if (this._searchDate != value) {
          this._searchDate = value;
          this.NotifyPropertyChanged();
        }
      }
    }

  }

}