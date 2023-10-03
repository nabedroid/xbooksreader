using System;

namespace ConsoleApp1 {

  internal class Program {
    static void Main(string[] args) {
      string inputJsonPath = "C:\\work\\cs\\XBooksReader\\ConsoleApp1\\test.json";
      string outputJsonPath = "C:\\work\\cs\\XBooksReader\\ConsoleApp1\\out.json";
      XBooksData data = XBookDataIO.Read(inputJsonPath);
      Console.WriteLine(data.books["1000001"].Title);
      XBookDataIO.Write(data, outputJsonPath);
    }
  }
}
