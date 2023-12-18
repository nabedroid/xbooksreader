using Nabedroid.XBooksReader.Common;
using System.Linq;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  internal class SearchTabFolderTreeView : AbstractSearchTabTreeView<string, Book> {

    protected override void InitializeTreeView() {
    }

    protected override void Add(TreeNode node) {

      TreeNode volumeNode, parentNode, childNode;
      // 表示している階層を削除
      // 各ファイルパス内に存在するフォルダをノードとして登録
      Book book = node.Tag as Book;

      // ボリューム・フォルダごとに区切る
      string[] paths = book.Path.Split(System.IO.Path.DirectorySeparatorChar);
      // ボリュームが登録されていない場合は登録する
      string volume = paths[0];
      if (_treeView.Nodes.ContainsKey(volume) == false) {
        volumeNode = _treeView.Nodes.Add(volume, volume);
      }
      volumeNode = _treeView.Nodes[volume];

      // 各フォルダも登録する
      parentNode = volumeNode;
      for (int i = 1; i < paths.Length - 1; i++) {
        string folder = paths[i];
        if (parentNode.Nodes.ContainsKey(folder) == false) {
          childNode = parentNode.Nodes.Add(folder, folder);
        }
        childNode = parentNode.Nodes[folder];
        parentNode = childNode;

        Remove(node);
      }
      
    }

  }

}
