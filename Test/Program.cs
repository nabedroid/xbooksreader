using System;
using System.Runtime.InteropServices;

[ComImport]
[Guid("019F7152-E6DB-11d0-83C3-00C04FDDB82E")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IFELanguage {
  /// <summary>
  /// 初期化
  /// </summary>
  int Open();
  /// <summary>
  /// 終了
  /// </summary>
  int Close();
  /// <summary>
  /// 形態解析結果を取得
  /// </summary>
  /// <param name="dwRequest">変換リクエスト、FELANG_REQ_XXX いずれかの値</param>
  /// <param name="dwCMode">変換出力文字と変換オプション、FELANG_CMODE_XXX 1つ以上の組み合わせ（OR）</param>
  /// <param name="cwchInput">pwchInputの文字数</param>
  /// <param name="pwchInput">形態素エンジンによって変換される入力文字（UNICODE）
  ///                         このパラメータをNULLに設定すると前に入力した文字列の次のランクの次のエントリが取得される
  ///                         次のエントリが返される順序は実装によって定義される</param>
  /// <param name="pfCInfo">各列の情報。各pfCInfo[x]はpwchInput[x]に対応、各DWORDはFELANG_CLMN_XXXの組み合わせ</param>
  /// <param name="ppResult">モルフォロジー結果データを受け取るMORRSLT構造体のアドレス</param>
  /// <returns>HRESULT</returns>
  int GetJMorphResult(uint dwRequest, uint dwCMode, int cwchInput, [MarshalAs(UnmanagedType.LPWStr)] string pwchInput, IntPtr pfCInfo, out IntPtr ppResult);
  /// <summary>
  /// IFELanguage オブジェクトの変換モード機能を取得
  /// </summary>
  /// <param name="pdwCaps">FELANG_CMODE_XXX 1つ以上の組み合わせとして表される機能</param>
  /// <returns>HRESULT</returns>
  int GetConversionModeCaps(ref uint pdwCaps);
  /// <summary>
  /// 指定した文字列の日本語のふりがなを取得
  /// </summary>
  /// <param name="string">変換する文字列</param>
  /// <param name="start">変換を開始する開始文字（最初の文字は、0ではなく1）</param>
  /// <param name="length">変換する文字数（-1 の場合、先頭から残りのすべての文字が変換）</param>
  /// <param name="result">変換された文字列</param>
  /// <returns>HRESULT</returns>
  int GetPhonetic([MarshalAs(UnmanagedType.BStr)] string @string, int start, int length, [MarshalAs(UnmanagedType.BStr)] out string result);
  /// <summary>
  /// 入力文字列 (通常はひらがな文字を含む) を変換された文字列に変換
  /// </summary>
  /// <param name="string">変換するふりがなの文字列</param>
  /// <param name="start">変換を開始する開始文字（最初の文字は、0ではなく1）</param>
  /// <param name="length">変換する文字数（-1 の場合、先頭から残りのすべての文字が変換）</param>
  /// <param name="result">変換された文字列</param>
  /// <returns>HRESULT</returns>
  int GetConversion([MarshalAs(UnmanagedType.BStr)] string @string, int start, int length, [MarshalAs(UnmanagedType.BStr)] out string result);
}

public class FELanguage : IDisposable {

  #region
  public static readonly uint FELANG_REQ_CONV = 0x00010000;
  public static readonly uint FELANG_REQ_RECONV = 0x00020000;
  public static readonly uint FELANG_REQ_REV = 0x00030000;
  public static readonly uint FELANG_CMODE_MONORUBY = 0x00000002; // 漢字の文字の上のフリガナ、paMonoBubyPosに返って来る
  public static readonly uint FELANG_CMODE_NOPRUNING = 0x00000004; // No pruning.
  public static readonly uint FELANG_CMODE_KATAKANAOUT = 0x00000008; // カタカナ出力
  public static readonly uint FELANG_CMODE_HIRAGANAOUT = 0x00000000; // ひらがな出力（デフォルト）
  public static readonly uint FELANG_CMODE_HALFWIDTHOUT = 0x00000010; // 半角出力
  public static readonly uint FELANG_CMODE_FULLWIDTHOUT = 0x00000020; // 全角出力
  public static readonly uint FELANG_CMODE_BOPOMOFO = 0x00000040; // 台湾発音?
  public static readonly uint FELANG_CMODE_HANGUL = 0x00000080; // ハングル発音?
  public static readonly uint FELANG_CMODE_PINYIN = 0x00000100; // 中国発音?
  public static readonly uint FELANG_CMODE_PRECONV = 0x00000200; // 以下の変換を実施: ローマ字を仮名、変換前にオートコレクト、句読点と括弧の変換
  public static readonly uint FELANG_CMODE_RADICAL = 0x00000400; // ?
  public static readonly uint FELANG_CMODE_UNKNOWNREADING = 0x00000800; // ?
  public static readonly uint FELANG_CMODE_MERGECAND = 0x00001000; // Merge display with the same candidate.
  public static readonly uint FELANG_CMODE_ROMAN = 0x00002000; // ?
  public static readonly uint FELANG_CMODE_BESTFIRST = 0x00004000; // Make only the first best.
  public static readonly uint FELANG_CMODE_USENOREVWORDS = 0x00008000; // Use invalid revword on REV/RECONV.
  public static readonly uint FELANG_CMODE_NONE = 0x01000000; // IME_SMODE_NONE
  public static readonly uint FELANG_CMODE_PLAURALCLAUSE = 0x02000000; // IME は複数文節情報を利用
  public static readonly uint FELANG_CMODE_SINGLECONVERT = 0x04000000; // IME は単文字モード
  public static readonly uint FELANG_CMODE_AUTOMATIC = 0x08000000; // IME は自動モード
  public static readonly uint FELANG_CMODE_PHRASEPREDICT = 0x10000000; // IME は語句情報を使用して次の文字を予測
  public static readonly uint FELANG_CMODE_CONVERSATION = 0x20000000; // IME は会話モード
  public static readonly uint FELANG_CMODE_NAME = 0x10000000; // Name mode (MSKKIME). FELANG_CMODE_PHRASEPREDICTと同じ
  public static readonly uint FELANG_CMODE_NOINVISIBLECHAR = 0x40000000; // Remove invisible chars (for example, the tone mark).
  public static readonly uint FELANG_CLMN_WBREAK = 0x01;
  public static readonly uint FELANG_CLMN_NOWBREAK = 0x02;
  public static readonly uint FELANG_CLMN_PBREAK = 0x04;
  public static readonly uint FELANG_CLMN_NOPBREAK = 0x08;
  public static readonly uint FELANG_CLMN_FIXR = 0x10;
  public static readonly uint FELANG_CLMN_FIXD = 0x20; // fix display of word
  #endregion

  private IFELanguage _ifelang;

  public FELanguage() {
    Type type = Type.GetTypeFromProgID("MSIME.Japan");
    this._ifelang = Activator.CreateInstance(type) as IFELanguage;
    int hr = this._ifelang.Open();
    if (hr != 0) {
      throw Marshal.GetExceptionForHR(hr) ?? throw new Exception($"{hr} is not error");
    }
  }

  public void Dispose() {
    this._ifelang?.Close();
  }

  public string GetJMorphResult(string str, uint dwRequest, uint dwCMode) {
    int hr = this._ifelang.GetJMorphResult(dwRequest, dwCMode, str.Length, str, IntPtr.Zero, out IntPtr result);
    if (hr != 0) {
      throw Marshal.GetExceptionForHR(hr) ?? throw new Exception($"{hr} is not error");
    }
    return Marshal.PtrToStringUni(Marshal.ReadIntPtr(result, 4), Marshal.ReadInt16(result, 8));
  }

  public string GetConversion(string str) {
    int hr = this._ifelang.GetConversion(str, 1, -1, out string kanzi);
    if (hr != 0) {
      throw Marshal.GetExceptionForHR(hr) ?? throw new Exception($"{hr} is not error");
    }
    return kanzi;
  }

  public string GetPhonetic(string str) {
    int hr = this._ifelang.GetPhonetic(str, 1, -1, out string yomigana);
    if (hr != 0) {
      throw Marshal.GetExceptionForHR(hr) ?? throw new Exception($"{hr} is not error");
    }
    return yomigana;
  }

  public string GetKatakana(string str) {
    return this.GetJMorphResult(str, FELANG_REQ_REV, FELANG_CMODE_KATAKANAOUT | FELANG_CMODE_PRECONV);
  }

  public string GetKanzi(string str) {
    return this.GetJMorphResult(str, FELANG_REQ_CONV, FELANG_CMODE_PRECONV);
  }

  public string GetHiragana(string str) {
    return this.GetJMorphResult(str, FELANG_REQ_REV, FELANG_CMODE_PRECONV);
  }

}

internal class Program {
  [STAThread]
  static void Main(string[] args) {
    string kanzi = "漢字";
    IFELanguage ife = null;
    try {
      // Raw IFE Ver
      ife = Activator.CreateInstance(Type.GetTypeFromProgID("MSIME.Japan")) as IFELanguage;
      ife.Open();
      ife.GetJMorphResult(0x00030000, 0x00000008, kanzi.Length, kanzi, IntPtr.Zero, out IntPtr result);
      string katakana = Marshal.PtrToStringUni(Marshal.ReadIntPtr(result, 4), Marshal.ReadInt16(result, 8));
      System.Console.WriteLine($"{kanzi} => {katakana}");
      // FELanguage Ver
      FELanguage fe = new FELanguage();
      katakana = fe.GetKatakana(kanzi);
      System.Console.WriteLine($"{kanzi} => {katakana}");
    } finally {
      ife?.Close();
    }
    System.Console.ReadKey();
  }
}
