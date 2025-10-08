namespace Nabedroid.XBooksReader.FormsControlLibrary {
  partial class BookListControl {
    /// <summary> 
    /// 必要なデザイナー変数です。
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    #region コンポーネント デザイナーで生成されたコード

    /// <summary> 
    /// デザイナー サポートに必要なメソッドです。このメソッドの内容を 
    /// コード エディターで変更しないでください。
    /// </summary>
    private void InitializeComponent() {
      this.splitContainer1 = new System.Windows.Forms.SplitContainer();
      this._flowLayoutPanelTop = new System.Windows.Forms.FlowLayoutPanel();
      this._checkBoxDesc = new System.Windows.Forms.CheckBox();
      this._comboBoxSort = new System.Windows.Forms.ComboBox();
      this.label1 = new System.Windows.Forms.Label();
      this._checkBoxFavorite = new System.Windows.Forms.CheckBox();
      this._flowLayoutPanelBottom = new System.Windows.Forms.FlowLayoutPanel();
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
      this.splitContainer1.Panel1.SuspendLayout();
      this.splitContainer1.Panel2.SuspendLayout();
      this.splitContainer1.SuspendLayout();
      this._flowLayoutPanelTop.SuspendLayout();
      this.SuspendLayout();
      // 
      // splitContainer1
      // 
      this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.splitContainer1.Location = new System.Drawing.Point(0, 0);
      this.splitContainer1.Name = "splitContainer1";
      this.splitContainer1.Orientation = System.Windows.Forms.Orientation.Horizontal;
      // 
      // splitContainer1.Panel1
      // 
      this.splitContainer1.Panel1.Controls.Add(this._flowLayoutPanelTop);
      // 
      // splitContainer1.Panel2
      // 
      this.splitContainer1.Panel2.Controls.Add(this._flowLayoutPanelBottom);
      this.splitContainer1.Size = new System.Drawing.Size(496, 460);
      this.splitContainer1.SplitterDistance = 29;
      this.splitContainer1.TabIndex = 0;
      // 
      // _flowLayoutPanelTop
      // 
      this._flowLayoutPanelTop.Controls.Add(this._checkBoxDesc);
      this._flowLayoutPanelTop.Controls.Add(this._comboBoxSort);
      this._flowLayoutPanelTop.Controls.Add(this.label1);
      this._flowLayoutPanelTop.Controls.Add(this._checkBoxFavorite);
      this._flowLayoutPanelTop.Dock = System.Windows.Forms.DockStyle.Fill;
      this._flowLayoutPanelTop.Location = new System.Drawing.Point(0, 0);
      this._flowLayoutPanelTop.Name = "_flowLayoutPanelTop";
      this._flowLayoutPanelTop.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
      this._flowLayoutPanelTop.Size = new System.Drawing.Size(496, 29);
      this._flowLayoutPanelTop.TabIndex = 0;
      // 
      // _checkBoxDesc
      // 
      this._checkBoxDesc.AutoSize = true;
      this._checkBoxDesc.Location = new System.Drawing.Point(445, 3);
      this._checkBoxDesc.Name = "_checkBoxDesc";
      this._checkBoxDesc.Size = new System.Drawing.Size(48, 16);
      this._checkBoxDesc.TabIndex = 3;
      this._checkBoxDesc.Text = "降順";
      this._checkBoxDesc.UseVisualStyleBackColor = true;
      // 
      // _comboBoxSort
      // 
      this._comboBoxSort.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
      this._comboBoxSort.Location = new System.Drawing.Point(372, 3);
      this._comboBoxSort.Name = "_comboBoxSort";
      this._comboBoxSort.Size = new System.Drawing.Size(67, 20);
      this._comboBoxSort.TabIndex = 0;
      // 
      // label1
      // 
      this.label1.Location = new System.Drawing.Point(324, 0);
      this.label1.Name = "label1";
      this.label1.Size = new System.Drawing.Size(42, 23);
      this.label1.TabIndex = 1;
      this.label1.Text = "ソート";
      this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
      // 
      // _checkBoxFavorite
      // 
      this._checkBoxFavorite.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
      this._checkBoxFavorite.AutoSize = true;
      this._checkBoxFavorite.Location = new System.Drawing.Point(243, 3);
      this._checkBoxFavorite.Name = "_checkBoxFavorite";
      this._checkBoxFavorite.Size = new System.Drawing.Size(75, 20);
      this._checkBoxFavorite.TabIndex = 2;
      this._checkBoxFavorite.Text = "お気に入り";
      this._checkBoxFavorite.UseVisualStyleBackColor = true;
      // 
      // _flowLayoutPanelBottom
      // 
      this._flowLayoutPanelBottom.Dock = System.Windows.Forms.DockStyle.Fill;
      this._flowLayoutPanelBottom.Location = new System.Drawing.Point(0, 0);
      this._flowLayoutPanelBottom.Name = "_flowLayoutPanelBottom";
      this._flowLayoutPanelBottom.Size = new System.Drawing.Size(496, 427);
      this._flowLayoutPanelBottom.TabIndex = 0;
      // 
      // BookListControl
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.Controls.Add(this.splitContainer1);
      this.Name = "BookListControl";
      this.Size = new System.Drawing.Size(496, 460);
      this.splitContainer1.Panel1.ResumeLayout(false);
      this.splitContainer1.Panel2.ResumeLayout(false);
      ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
      this.splitContainer1.ResumeLayout(false);
      this._flowLayoutPanelTop.ResumeLayout(false);
      this._flowLayoutPanelTop.PerformLayout();
      this.ResumeLayout(false);

    }

    #endregion

    private System.Windows.Forms.SplitContainer splitContainer1;
    private System.Windows.Forms.FlowLayoutPanel _flowLayoutPanelTop;
    private System.Windows.Forms.CheckBox _checkBoxFavorite;
    private System.Windows.Forms.Label label1;
    private System.Windows.Forms.ComboBox _comboBoxSort;
    private System.Windows.Forms.FlowLayoutPanel _flowLayoutPanelBottom;
    private System.Windows.Forms.CheckBox _checkBoxDesc;
  }
}
