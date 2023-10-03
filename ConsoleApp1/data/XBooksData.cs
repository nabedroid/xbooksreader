using System.Collections.Generic;

public class XBooksData {
  public Dictionary<string, Book> books { get; set; }
  public Dictionary<string, Character> characters { get; set; }
  public Dictionary<string, Circle> circles { get; set; }
  public Dictionary<string, Original> originals { get; set; }
  public Dictionary<string, Tag> tags { get; set; }
  public Dictionary<string, Writer> writers { get; set; }
  public int book_next_id { get; set; }
  public int character_next_id { get; set; }
  public int circle_next_id { get; set; }
  public int original_next_id { get; set; }
  public int tag_next_id { get; set; }
  public int writer_next_id { get; set; }
}