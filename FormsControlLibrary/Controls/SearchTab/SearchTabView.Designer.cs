namespace Nabedroid.XBooksReader.FormsControlLibrary {
  partial class SearchTabView {
    /// <summary> 
    /// 必要なデザイナー変数です。
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary> 
    /// 使用中のリソースをすべてクリーンアップします。
    /// </summary>
    /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
    protected override void Dispose(bool disposing) {
      if (disposing && (components != null)) {
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    #region コンポーネント デザイナーで生成されたコード

    /// <summary> 
    /// デザイナー サポートに必要なメソッドです。このメソッドの内容を 
    /// コード エディターで変更しないでください。
    /// </summary>
    private void InitializeComponent() {
      this.tabControl1 = new System.Windows.Forms.TabControl();
      this.tabPageHome = new System.Windows.Forms.TabPage();
      this.tabPageFolder = new System.Windows.Forms.TabPage();
      this.tabPageCharacter = new System.Windows.Forms.TabPage();
      this.tabPageOriginal = new System.Windows.Forms.TabPage();
      this.tabPageCircle = new System.Windows.Forms.TabPage();
      this.tabPageTag = new System.Windows.Forms.TabPage();
      this.tabControl1.SuspendLayout();
      this.SuspendLayout();
      // 
      // tabControl1
      // 
      this.tabControl1.Controls.Add(this.tabPageHome);
      this.tabControl1.Controls.Add(this.tabPageFolder);
      this.tabControl1.Controls.Add(this.tabPageCharacter);
      this.tabControl1.Controls.Add(this.tabPageOriginal);
      this.tabControl1.Controls.Add(this.tabPageCircle);
      this.tabControl1.Controls.Add(this.tabPageTag);
      this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
      this.tabControl1.Location = new System.Drawing.Point(0, 0);
      this.tabControl1.Name = "tabControl1";
      this.tabControl1.SelectedIndex = 0;
      this.tabControl1.Size = new System.Drawing.Size(344, 546);
      this.tabControl1.TabIndex = 0;
      // 
      // tabPageHome
      // 
      this.tabPageHome.Location = new System.Drawing.Point(4, 22);
      this.tabPageHome.Name = "tabPageHome";
      this.tabPageHome.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageHome.Size = new System.Drawing.Size(336, 520);
      this.tabPageHome.TabIndex = 0;
      this.tabPageHome.Text = "ホーム";
      this.tabPageHome.UseVisualStyleBackColor = true;
      // 
      // tabPageFolder
      // 
      this.tabPageFolder.Location = new System.Drawing.Point(4, 22);
      this.tabPageFolder.Name = "tabPageFolder";
      this.tabPageFolder.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageFolder.Size = new System.Drawing.Size(336, 520);
      this.tabPageFolder.TabIndex = 1;
      this.tabPageFolder.Text = "フォルダ";
      this.tabPageFolder.UseVisualStyleBackColor = true;
      // 
      // tabPageCharacter
      // 
      this.tabPageCharacter.Location = new System.Drawing.Point(4, 22);
      this.tabPageCharacter.Name = "tabPageCharacter";
      this.tabPageCharacter.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageCharacter.Size = new System.Drawing.Size(336, 520);
      this.tabPageCharacter.TabIndex = 2;
      this.tabPageCharacter.Text = "キャラ";
      this.tabPageCharacter.UseVisualStyleBackColor = true;
      // 
      // tabPageOriginal
      // 
      this.tabPageOriginal.Location = new System.Drawing.Point(4, 22);
      this.tabPageOriginal.Name = "tabPageOriginal";
      this.tabPageOriginal.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageOriginal.Size = new System.Drawing.Size(336, 520);
      this.tabPageOriginal.TabIndex = 3;
      this.tabPageOriginal.Text = "原作";
      this.tabPageOriginal.UseVisualStyleBackColor = true;
      // 
      // tabPageCircle
      // 
      this.tabPageCircle.Location = new System.Drawing.Point(4, 22);
      this.tabPageCircle.Name = "tabPageCircle";
      this.tabPageCircle.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageCircle.Size = new System.Drawing.Size(336, 520);
      this.tabPageCircle.TabIndex = 4;
      this.tabPageCircle.Text = "サークル";
      this.tabPageCircle.UseVisualStyleBackColor = true;
      // 
      // tabPageTag
      // 
      this.tabPageTag.Location = new System.Drawing.Point(4, 22);
      this.tabPageTag.Name = "tabPageTag";
      this.tabPageTag.Padding = new System.Windows.Forms.Padding(3);
      this.tabPageTag.Size = new System.Drawing.Size(336, 520);
      this.tabPageTag.TabIndex = 5;
      this.tabPageTag.Text = "タグ";
      this.tabPageTag.UseVisualStyleBackColor = true;
      // 
      // SearchTabView
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.Controls.Add(this.tabControl1);
      this.Name = "SearchTabView";
      this.Size = new System.Drawing.Size(344, 546);
      this.tabControl1.ResumeLayout(false);
      this.ResumeLayout(false);

    }

    #endregion

    private System.Windows.Forms.TabControl tabControl1;
    private System.Windows.Forms.TabPage tabPageHome;
    private System.Windows.Forms.TabPage tabPageFolder;
    private System.Windows.Forms.TabPage tabPageCharacter;
    private System.Windows.Forms.TabPage tabPageCircle;
    private System.Windows.Forms.TabPage tabPageTag;
    private System.Windows.Forms.TabPage tabPageOriginal;
  }
}
