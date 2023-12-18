using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace Nabedroid.XBooksReader.Common {

  public class Book : ITreeNodeObservableItem {

    public event PropertyChangedEventHandler PropertyChanged;

    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    private int _id;
    private string _title;
    private string _kana;
    private List<int> _characters = new List<int>();
    private List<int> _originals = new List<int>();
    private List<int> _tags = new List<int>();
    private List<int> _circles = new List<int>();
    private List<int> _writers = new List<int>();
    private int _evalution { get; set; }
    private DateTimeOffset _viewDate { get; set; } = DateTimeOffset.MinValue;
    private DateTimeOffset _createDate { get; set; } = DateTimeOffset.MinValue;
    private string _path { get; set; }
    private List<int> _bookmarks { get; set; } = new List<int>();
    private bool _favorite { get; set; }
    private int _previousBook { get; set; }
    private int _nextBook { get; set; }
    private int _count { get; set; }
    private string _thumbnail { get; set; }

    public int Id {
      get { return this._id; }
      set {
        if (this._id != value) {
          this._id = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public string Title {
      get { return this._title; }
      set {
        if (this._title != value) {
          this._title = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public string Kana {
      get { return this._kana; }
      set {
        if (this._kana != value) {
          this._kana = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Characters {
      get { return this._characters; }
      set {
        if (this._characters != value) {
          this._characters = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Originals {
      get { return this._originals; }
      set {
        if (this._originals != value) {
          this._originals = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Tags {
      get { return this._tags; }
      set {
        if (this._tags != value) {
          this._tags = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Circles {
      get { return this._circles; }
      set {
        if (this._circles != value) {
          this._circles = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Writers {
      get { return this._writers; }
      set {
        if (this._writers != value) {
          this._writers = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public int Evalution {
      get { return this._evalution; }
      set {
        if (this._evalution != value) {
          this._evalution = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public DateTimeOffset ViewDate {
      get { return this._viewDate; }
      set {
        if (this._viewDate != value) {
          this._viewDate = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public DateTimeOffset CreateDate {
      get { return this._createDate; }
      set {
        if (this._createDate != value) {
          this._createDate = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public string Path {
      get { return this._path; }
      set {
        if (this._path != value) {
          this._path = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public List<int> Bookmarks {
      get { return this._bookmarks; }
      set {
        if (this._bookmarks != value) {
          this._bookmarks = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public bool Favorite {
      get { return this._favorite; }
      set {
        if (this._favorite != value) {
          this._favorite = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public int PreviousBook {
      get { return this._previousBook; }
      set {
        if (this._previousBook != value) {
          this._previousBook = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public int NextBook {
      get { return this._nextBook; }
      set {
        if (this._nextBook != value) {
          this._nextBook = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public int Count {
      get { return this._count; }
      set {
        if (this._count != value) {
          this._count = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public string Thumbnail {
      get { return this._thumbnail; }
      set {
        if (this._thumbnail != value) {
          this._thumbnail = value;
          this.NotifyPropertyChanged();
        }
      }
    }

    public override string ToString() {
      string charas = string.Join(",", _characters);
      string oris = string.Join(",", _originals);
      string tags = string.Join(",", _tags);
      string cirs = string.Join(",", _circles);
      string wris = string.Join(",", _writers);
      string marks = string.Join(",", _bookmarks);

      return $"" +
        $"ID: {_id} Title: {_title} Kana: {_kana} Path: {_path}" +
        $"Characters: [{charas}] Origins: [{oris}] Tags: [{tags}] Circles: [{cirs}] Writers: [{wris}] BookMarks: [{marks}]" +
        $"Evalution: {_evalution} Favorite: {_favorite} " +
        $"ViewDate: {_viewDate} CreateDate: {_createDate} " +
        $"PreviousBook: {_previousBook} NextBook: {_nextBook} Count: {_count} ";
    }

    string ITreeNodeObservableItem.Key { get { return this._id.ToString(); } }
    string ITreeNodeObservableItem.Text { get { return this._title; } }
    string ITreeNodeObservableItem.SortKey { get { return this._kana; } }

    public List<string> GetBookImageFiles() {
      return FileUtil.GetDirectoryImageFiles(_path);
    }


  }

}