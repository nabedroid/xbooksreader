using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

namespace Nabedroid.XBooksReader.Common {

  public class XBooksData : INotifyPropertyChanged {

    public static readonly string DefaultFileName = "xbooksdata.json";

    public event PropertyChangedEventHandler PropertyChanged;

    public ObservableDictionary<string, Book> _books = new ObservableDictionary<string, Book>();
    public ObservableDictionary<string, Character> _characters = new ObservableDictionary<string, Character>();
    public ObservableDictionary<string, Circle> _circles = new ObservableDictionary<string, Circle>();
    public ObservableDictionary<string, Original> _originals = new ObservableDictionary<string, Original>();
    public ObservableDictionary<string, Tag> _tags = new ObservableDictionary<string, Tag>();
    public ObservableDictionary<string, Writer> _writers = new ObservableDictionary<string, Writer>();
    public ObservableDictionary<string, SearchPath> _searchPaths = new ObservableDictionary<string, SearchPath>();
    public int _bookNextId = 1;
    public int _characterNextId = 1;
    public int _circleNextId = 1;
    public int _originalNextId = 1;
    public int _tagNextId = 1;
    public int _writerNextId = 1;
    public int _searchPathNextId = 1;
    public string _jsonPath = string.Empty;

    public XBooksData() { }
    public XBooksData(string jsonPath) {
      Open(jsonPath);
    }

    private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
      PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    public void New() {
      string path = Path.Combine(Environment.CurrentDirectory, DefaultFileName);
      if (Directory.Exists(path)) {
        // ファイルが存在する場合は別のファイル名にする
        string defaultFileNameWithoutExtension = Path.GetFileNameWithoutExtension(DefaultFileName);
        string defaultFileExtension = Path.GetExtension(DefaultFileName);
        int i = 1;
        do {
          path = Path.Combine(Environment.CurrentDirectory, defaultFileNameWithoutExtension + i + defaultFileExtension);
        } while (Directory.Exists(path));
      }
      New(path);
    }

    public void New(string path) {
      JsonPath = path;
      Save();
    }

    public void Open(string jsonPath) {
      XBooksData data = new XBooksData();

      // jsonファイルを読み込み XBookData 型に変換する
      // 一旦テキストファイルとしてjsonファイルを読み込む
      string jsonString = File.ReadAllText(jsonPath);
      // XBooksDataJsonに変換
      data = JsonSerializer.Deserialize<XBooksData>(jsonString, new JsonSerializerOptions {
        // キー名は先頭小文字のキャメルケース
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
      });
      // 自身に読み込んだデータを割り当てる
      Books = data.Books;
      Characters = data.Characters;
      Circles = data.Circles;
      Originals = data.Originals;
      Tags = data.Tags;
      Writers = data.Writers;
      SearchPaths = data.SearchPaths;
      BookNextId = data.BookNextId;
      CharacterNextId = data.CharacterNextId;
      CircleNextId = data.CircleNextId;
      OriginalNextId = data.OriginalNextId;
      TagNextId = data.TagNextId;
      WriterNextId = data.WriterNextId;
      SearchPathNextId = data.SearchPathNextId;
      JsonPath = jsonPath;
    }

    /// <summary>
    /// 設定ファイルを上書き保存する
    /// </summary>
    public void Save() {
      SaveAs(JsonPath);
    }

    /// <summary>
    /// 設定ファイルを指定されたパスに保存する
    /// </summary>
    /// <param name="path">保存先のファイルパス</param>
    public void SaveAs(String path) {
      JsonPath = path;
      string jsonString = JsonSerializer.Serialize(this, new JsonSerializerOptions {
        // インデント付き
        WriteIndented = true,
        // キー名は先頭小文字のキャメルケース
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        // 出力時に文字を文字コードに置き換えない（これを指定しないと\u3000のように文字コードで出力される
        // ただし、プログラム上で扱う際には問題なくエンコード/デコードされるので必須ではない
        // また全角スペース含むセパレータ関連は何故か置き換えてくれず文字コードがそのまま出力される
        Encoder = JavaScriptEncoder.Create(UnicodeRanges.All),
      });
      File.WriteAllText(path, jsonString, System.Text.Encoding.UTF8);
    }

    public Book Add(Book book) {
      book.Id = BookNextId;
      Books.Add(BookNextId.ToString(), book);
      BookNextId = BookNextId + 1;
      return book;
    }

    public void Remove(Book book) {
      Books.Remove(book.Id.ToString());
    }

    public Character Add(Character character) {
      character.Id = CharacterNextId;
      Characters.Add(character.Id.ToString(), character);
      CharacterNextId = CharacterNextId + 1;
      return character;
    }

    public void Remove(Character character) {
      Characters.Remove(character.Id.ToString());
    }

    public Circle Add(Circle circle) {
      circle.Id = CircleNextId;
      Circles.Add(circle.Id.ToString(), circle);
      CircleNextId = CircleNextId + 1;
      return circle;
    }

    public void Remove(Circle circle) {
      Circles.Remove(circle.Id.ToString());
    }

    public Original Add(Original original) {
      original.Id = OriginalNextId;
      Originals.Add(original.Id.ToString(), original);
      OriginalNextId = OriginalNextId + 1;
      return original;
    }

    public void Remove(Original original) {
      Originals.Remove(original.Id.ToString());
    }

    public Tag Add(Tag tag) {
      tag.Id = TagNextId;
      Tags.Add(tag.Id.ToString(), tag);
      TagNextId = TagNextId + 1;
      return tag;
    }

    public void Remove(Tag tag) {
      Tags.Remove(tag.Id.ToString());
    }

    public Writer Add(Writer writer) {
      writer.Id = WriterNextId;
      Writers.Add(writer.Id.ToString(), writer);
      WriterNextId = WriterNextId + 1;
      return writer;
    }

    public void Remove(Writer writer) {
      Writers.Remove(writer.Id.ToString());
    }

    public SearchPath Add(SearchPath searchPath) {
      searchPath.Id = SearchPathNextId;
      SearchPaths.Add(searchPath.Id.ToString(), searchPath);
      SearchPathNextId = SearchPathNextId + 1;
      return searchPath;
    }

    public void Remove(SearchPath searchPath) {
      SearchPaths.Remove(searchPath.Id.ToString());
      NotifyPropertyChanged();
    }

    /// <summary>
    /// 検索対象ディレクトリの及びそのサブディレクトリ内の
    /// 画像フォルダを Books に追加する
    /// </summary>
    public void Search() {
      foreach (SearchPath searchPath in SearchPaths.Values) {
        Search(searchPath);
      }
    }

    /// <summary>
    /// 検索対象ディレクトリの及びそのサブディレクトリ内の
    /// 画像フォルダを Books に追加する
    /// </summary>
    /// <param name="searchPath">検索対象ディレクトリパス</param>
    public void Search(SearchPath searchPath) {

      // 読み仮名変換
      FELanguage ime = new FELanguage();
      // 設定ファイルに登録済みのディレクトリ一覧を取得
      Dictionary<string, Book> path2book = new Dictionary<string, Book>();
      foreach (Book book in Books.Values) {
        path2book.Add(book.Path, book);
      }
      // 画像ファイルが存在するディレクトリを取得
      foreach (string dirPath in Directory.EnumerateDirectories(searchPath.Path, "*", SearchOption.AllDirectories)) {
        // 登録済みのディレクトリの場合はスキップ
        if (path2book.ContainsKey(dirPath)) continue;
        List<string> images = FileUtil.GetDirectoryImageFiles(dirPath);
        if (images?.Count > 0) {
          // 画像ファイルが存在するディレクトリの場合
          images.Sort();
          string fileName = Path.GetFileName(dirPath);
          Book book = new Book {
            Title = Path.GetFileName(fileName),
            Kana = ime.GetKatakana(fileName),
            Path = dirPath,
            Thumbnail = images[0],
            CreateDate = DateTimeOffset.Now,
          };
          Add(book);
        }
      }
      searchPath.SearchDate = DateTimeOffset.Now;
    }

    public List<Book> SelectBook(AbstractBookFilter filter, int max = 30) {
      List<Book> books = new List<Book>();
      foreach (Book book in Books.Values) {
        if (filter.Match(book)) {
          books.Add(book);
          if (books.Count > max) {
            break;
          }
        }
      }
      return books;
    }

    #region Property
    public ObservableDictionary<string, Book> Books { get { return _books; } set { if (_books != value) { _books = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, Character> Characters { get { return _characters; } set { if (_characters != value) { _characters = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, Circle> Circles { get { return _circles; } set { if (_circles != value) { _circles = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, Original> Originals { get { return _originals; } set { if (_originals != value) { _originals = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, Tag> Tags { get { return _tags; } set { if (_tags != value) { _tags = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, Writer> Writers { get { return _writers; } set { if (_writers != value) { _writers = value; NotifyPropertyChanged(); } } }
    public ObservableDictionary<string, SearchPath> SearchPaths { get { return _searchPaths; } set { if (_searchPaths != value) { _searchPaths = value; NotifyPropertyChanged(); } } }
    public int BookNextId { get { return _bookNextId; } set { if (_bookNextId != value) { _bookNextId = value; NotifyPropertyChanged(); } } }
    public int CharacterNextId { get { return _characterNextId; } set { if (_characterNextId != value) { _characterNextId = value; NotifyPropertyChanged(); } } }
    public int CircleNextId { get { return _circleNextId; } set { if (_circleNextId != value) { _circleNextId = value; NotifyPropertyChanged(); } } }
    public int OriginalNextId { get { return _originalNextId; } set { if (_originalNextId != value) { _originalNextId = value; NotifyPropertyChanged(); } } }
    public int TagNextId { get { return _tagNextId; } set { if (_tagNextId != value) { _tagNextId = value; NotifyPropertyChanged(); } } }
    public int WriterNextId { get { return _writerNextId; } set { if (_writerNextId != value) { _writerNextId = value; NotifyPropertyChanged(); } } }
    public int SearchPathNextId { get { return _searchPathNextId; } set { if (_searchPathNextId != value) { _searchPathNextId = value; NotifyPropertyChanged(); } } }
    public string JsonPath { get { return _jsonPath; } set { if (_jsonPath != value) { _jsonPath = value; NotifyPropertyChanged(); } } }
    #endregion

  }

}