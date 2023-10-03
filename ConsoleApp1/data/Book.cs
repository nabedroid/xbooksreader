using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

public class Book {
  public event PropertyChangedEventHandler PropertyChanged;

  private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
  }

  private int _id;
  private string _title;
  private string _yomikata;
  private int[] _originals;
  private int[] _tags;
  private int[] _writers;
  private int _evalution { get; set; }
  private DateTimeOffset _update { get; set; }
  private string _path { get; set; }
  private int[] _bookmarks { get; set; }
  private bool _favorite { get; set; }
  private int _previousBook { get; set; }
  private int _nextBook { get; set; }
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

  public string Yomikata {
    get { return this._yomikata; }
    set {
      if (this._yomikata != value) {
        this._yomikata = value;
        this.NotifyPropertyChanged();
      }
    }
  }

  public int[] Originals {
    get { return this._originals; }
    set {
      if (this._originals != value) {
        this._originals = value;
        this.NotifyPropertyChanged();
      }
    }
  }

  public int[] Tags {
    get { return this._tags; }
    set {
      if (this._tags != value) {
        this._tags = value;
        this.NotifyPropertyChanged();
      }
    }
  }

  public int[] Writers {
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

  public DateTimeOffset Update {
    get { return this._update; }
    set { 
      if (this._update != value) {
        this._update = value;
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

  public int[] Bookmarks {
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

  public string Thumbnail {
    get { return this._thumbnail; }
    set { 
      if (this._thumbnail != value) {
        this._thumbnail = value;
        this.NotifyPropertyChanged();
      }
    }
  }

}