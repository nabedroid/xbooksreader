using System.Runtime.InteropServices;
using System;

namespace Nabedroid.XBooksReader.Common {

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

}