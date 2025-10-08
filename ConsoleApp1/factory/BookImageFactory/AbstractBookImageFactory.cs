using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {
  /// <summary>
  /// 画像ファイルを読み込み生成する抽象クラス
  /// </summary>
  public abstract class AbstractBookImageFactory : IDisposable {

    private bool _disposed;
    private ImageProcessor.ImageFactory _imageFactory;

    protected AbstractBookImageFactory() {
      _disposed = false;
      _imageFactory = new ImageProcessor.ImageFactory();
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    public void Dispose() {
      Dispose(true);
    }

    /// <summary>
    /// オブジェクトを破棄する
    /// </summary>
    /// <param name="disposing"></param>
    protected virtual void Dispose(bool disposing) {

      if (_disposed) return;

      if (disposing && _imageFactory != null) {
        _imageFactory.Dispose();
      }

      _disposed = true;
    }

    /// <summary>
    /// 本に対応するサムネイル画像を取得する
    /// </summary>
    /// <returns>サムネイル画像</returns>
    public virtual Image GetThumbnail(string imagePath) {
      Image image = GetImage(imagePath);
      // TODO: サイズを適宜変更できるようにしたい
      Image thumbnail = image.GetThumbnailImage(100, 150, () => false, IntPtr.Zero);
      image.Dispose();
      return thumbnail;
    }

    /// <summary>
    /// 本に対応するサムネイル画像を非同期で取得する
    /// </summary>
    /// <param name="token">キャンセルトークン</param>
    /// <returns>Task(サムネイル画像)</returns>
    public virtual async Task<Image> GetThumbnailAsync(string imagePath, CancellationToken token) {
      Image image = await GetImageAsync(imagePath, token);
      // TODO: サイズを適宜変更できるようにしたい
      Image thumbnail = image.GetThumbnailImage(100, 150, () => false, IntPtr.Zero);
      image.Dispose();
      return thumbnail;
    }

    /// <summary>
    /// フォルダまたは圧縮ファイル内に存在する画像ファイルのリストを取得する
    /// </summary>
    /// <returns>画像ファイルのリスト</returns>
    public virtual List<Image> GetImages() {
      List<Image> images = new List<Image>();
      foreach (string imagePath in GetImagePathList()) {
        images.Add(GetImage(imagePath));
      }
      return images;
    }

    /// <summary>
    /// フォルダまたは圧縮ファイル内に存在する画像ファイルのリストを非同期で取得する
    /// </summary>
    /// <param name="token">キャンセルトークン</param>
    /// <returns>Task(画像ファイルのリスト)</returns>
    public virtual Task<List<Image>> GetImagesAsync(CancellationToken token) {
      return Task.Run(async () => {
        List<Image> images = new List<Image>();
        foreach (string imagePath in GetImagePathList()) {
          Image image = await GetImageAsync(imagePath, token);
          images.Add(image);
        }
        return images;
      }, token);
    }

    protected virtual ImageProcessor.ImageFactory ImageFactory {
      get { return _imageFactory; }
    }

    /// <summary>
    /// フォルダまたは圧縮ファイル内に存在する画像ファイルのファイルパスのリストを取得する
    /// </summary>
    /// <returns>画像ファイルのファイルパスのリスト</returns>
    public abstract List<string> GetImagePathList();
    /// <summary>
    /// 画像ファイルを取得する
    /// </summary>
    /// <param name="imagePath">画像ファイルのファイルパス</param>
    /// <returns></returns>
    public abstract Image GetImage(string imagePath);
    /// <summary>
    /// 画像ファイルを非同期で取得する
    /// </summary>
    /// <param name="imagePath">画像ファイルのファイルパス</param>
    /// <param name="token">キャンセルトークン</param>
    /// <param name="bufferSize">メモリに読み込むバッファサイズ</param>
    /// <returns></returns>
    public abstract Task<Image> GetImageAsync(string imagePath, CancellationToken token, int bufferSize = 1024);

  }

}
