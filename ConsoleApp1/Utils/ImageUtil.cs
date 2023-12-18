using ImageProcessor;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Threading.Tasks;

namespace Nabedroid.XBooksReader.Common {

  public class ImageUtil {

    private ImageUtil() { }

    /// <summary>
    /// 画像ファイルを読み込んで System.Drawing.Image を作成する
    /// ImageProcessor.ImageFactory のラッパー
    /// </summary>
    /// <param name="path">ファイルパス</param>
    /// <returns>画像ファイル</returns>
    public static Image CreateImage(string path) {
      ImageFactory imageFactory = new ImageFactory();
      Image image = (Image)imageFactory.Load(path).Image.Clone();
      imageFactory.Dispose();
      return image;
    }

    public static Task<Image> CreateImageAsync(string path) {
      return Task.Run(() => CreateImage(path));
    }

    public static Image CreateImage(string path, int width = -1, int height = -1, int quality = -1) {
      ImageFactory imageFactory = new ImageFactory();
      imageFactory.Load(path);
      if (width > 0 && height > 0) {
        imageFactory.Resize(new Size(width, height));
      }
      if (quality > 0) {
        imageFactory.Quality(quality);
      }
      Image image = (Image)imageFactory.Image.Clone();
      imageFactory.Dispose();
      return image;
    }

    public static Task<Image> CreateImageAsync(string path, int width = -1, int height = -1, int quality = -1) {
      return Task.Run( () => {
        Image image = CreateImage(path, width, height, quality);
        return image;
      });
    }

  }

}
