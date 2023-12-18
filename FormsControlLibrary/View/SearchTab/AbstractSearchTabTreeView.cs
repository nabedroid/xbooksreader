using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Diagnostics;
using System.Windows.Forms;

using Nabedroid.XBooksReader.Common;

namespace Nabedroid.XBooksReader.FormsControlLibrary {

  public abstract class AbstractSearchTabTreeView<TKey, TValue> : UserControl {

    /// <summary>
    /// TreeNode クリック時のイベント
    /// </summary>
    public event TreeViewEventHandler TreeViewAfterSelect;

    /// <summary>
    /// TreeView で管理するデータ
    /// </summary>
    protected ObservableDictionary<TKey, TValue> _observableDictionary;
    protected TreeView _treeView;
    protected IContainer _components = null;

    public AbstractSearchTabTreeView() : base() {
      // Control 全般の初期化
      InitializeComponent();
      // TreeNode 初期化
      InitializeTreeView();
      // TreeNode クリック時のイベント追加
      _treeView.AfterSelect += this._TreeViewAfterSelect;
      // TreeNode のソート設定
      _treeView.TreeViewNodeSorter = new SearchTabTreeNodeSorter();
      _treeView.Sorted = true;
    }

    private void _TreeViewAfterSelect(object sender, TreeViewEventArgs e) {
      TreeViewAfterSelect?.Invoke(sender, e);
    }

    private void InitializeComponent() {
      this._treeView = new System.Windows.Forms.TreeView();
      this.SuspendLayout();
      // 
      // treeView1
      // 
      this._treeView.Dock = System.Windows.Forms.DockStyle.Fill;
      this._treeView.Location = new System.Drawing.Point(0, 0);
      this._treeView.Name = "TreeView";
      this._treeView.Size = new System.Drawing.Size(312, 410);
      this._treeView.TabIndex = 0;
      // 
      // UserControl2
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.Controls.Add(this._treeView);
      this.Name = "UserControl2";
      this.Size = new System.Drawing.Size(312, 410);
      this.ResumeLayout(false);

    }

    /// <summary>
    /// Control の破棄
    /// </summary>
    /// <param name="disposing"></param>
    protected override void Dispose(bool disposing) {
      DisposeTreeNodes();
      if (disposing && (_components != null)) {
        _components.Dispose();
      }
      base.Dispose(disposing);
    }

    /// <summary>
    /// TreeNode の各ノードを明示的に破棄する
    /// </summary>
    private void DisposeTreeNodes() {
      if (_treeView != null) {
        _treeView.BeginUpdate();
        DisposeTreeNodes(_treeView.Nodes);
        _treeView.EndUpdate();
      }
    }

    /// <summary>
    /// TreeNode の各ノードを明示的に破棄する
    /// </summary>
    /// <param name="nodes">TreeNodeCollection</param>
    private void DisposeTreeNodes(TreeNodeCollection nodes) {
      foreach (TreeNode child in nodes) {
        (child as IDisposable)?.Dispose();
        DisposeTreeNodes(child.Nodes);
      }
      nodes.Clear();
    }

    /// <summary>
    /// ObservableDictionary に登録されている Value の Property 値更新時に対応する TreeNode の値も併せて更新する
    /// </summary>
    /// <param name="sender">ITreeNodeTag</param>
    /// <param name="e">PropertyChangedEventArgs</param>
    private void CollectionMemberChanged(object sender, PropertyChangedEventArgs e) {
      ITreeNodeObservableItem item = sender as ITreeNodeObservableItem;
      TreeNode changeNode = _treeView.Nodes.Find(item.Key, true)[0];
      Remove(changeNode);
      Add(changeNode);
     
    }

    /// <summary>
    /// ObservableDictionary のデータ増減時に TreeNode も併せて増減させる
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    /// <exception cref="ArgumentException"></exception>
    private void CollectionChanged(object sender, NotifyCollectionChangedEventArgs e) {
      switch (e?.Action) {
        case NotifyCollectionChangedAction.Add:
          // データ追加時は TreeNode を追加する
          ITreeNodeObservableItem addItem = ((KeyValuePair<TKey, TValue>)e.NewItems[0]).Value as ITreeNodeObservableItem;
          TreeNode addNode = new TreeNodeObserve(addItem);
          addItem.PropertyChanged += CollectionMemberChanged;
          Add(addNode);
          break;
        case NotifyCollectionChangedAction.Remove:
          // データ削除時は TreeNode の削除と、削除されたデータに紐づくイベントハンドラも削除する
          ITreeNodeObservableItem removeItem = ((KeyValuePair<TKey, TValue>)e.OldItems[0]).Value as ITreeNodeObservableItem;
          TreeNode removeNode = _treeView.Nodes.Find(removeItem.Key, true)[0];
          Remove(removeNode);
          break;
        case NotifyCollectionChangedAction.Reset:
        case NotifyCollectionChangedAction.Replace:
        case NotifyCollectionChangedAction.Move:
          // ObservableDictionary に登録されていない想定外のアクションの場合はエラーとする
          throw new ArgumentException("NotifyCollectionChangedAction の Reset、Replace、Move は実装されていません。");
      }
    }

    /// <summary>
    /// TreeView の TreeNode ヘッダを作成する
    /// </summary>
    protected virtual void InitializeTreeView() {
      _treeView.Nodes.Clear();
    }

    /// <summary>
    /// TreeView に TreeNode を追加する
    /// </summary>
    /// <param name="node">追加する TreeNode</param>
    protected virtual void Add(TreeNode node) {
      _treeView.Nodes.Add(node);
    }

    /// <summary>
    /// TreeView から TreeNode を削除する
    /// </summary>
    /// <param name="node">削除する TreeNode</param>
    protected virtual void Remove(TreeNode node) {
      // 必要ならイベントハンドラを削除
      TreeNodeObserve treeNodeWithTagObserver = node as TreeNodeObserve;
      ITreeNodeObservableItem item = treeNodeWithTagObserver?.Tag as ITreeNodeObservableItem;
      if (item != null) {
        item.PropertyChanged -= CollectionMemberChanged;
      }
      // ノードから削除
      TreeNodeCollection parentNodeCollection = node.Parent == null ? node.TreeView?.Nodes : node.Parent.Nodes;
      parentNodeCollection?.Remove(node);
    }

    public ObservableDictionary<TKey, TValue> ObservableDictionary {
      set {
        // イベントハンドラだけ削除
        DisposeTreeNodes();
        _observableDictionary = value;
        // TreeView を初期化
        // 描画一時停止
        _treeView.BeginUpdate();
        InitializeTreeView();
        // データを TreeView に追加
        if (value != null) {
          // コレクションの増減時に TreeView の項目も併せて増減させる
          _observableDictionary.CollectionChanged += CollectionChanged;
          // 各データを TreeNode に変換して登録
          foreach (TValue collectionValue in _observableDictionary.Values) {
            TreeNode node = null;
            ITreeNodeObservableItem item = collectionValue as ITreeNodeObservableItem;
            if (item != null) {
              node = new TreeNodeObserve(item);
              item.PropertyChanged += CollectionMemberChanged;
            } else {
              node = new TreeNode(collectionValue.ToString()) { Tag = collectionValue };
            }
            Add(node);
          }
        }
        // 描画再開
        _treeView.EndUpdate();
      }
    }

  }

}
