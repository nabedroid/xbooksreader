# �T�v

# TODO
- �t�H���_�\���Ō����ΏۂƂ���t�H���_�̒ǉ��@�\
- �{�I�̃u�b�N�{�^���̗��̊����P

# �J������


## �\�����[�V�����ƃv���W�F�N�g
�C���[�W�Ƃ��ẮA�\�����[�V�����i���i�j����邽�߂̃v���W�F�N�g�i���i�j�Ƃ����֌W�B

## Windows �R���\�[���A�v��
GUI���g�p�����ɗ����œ����悤�ȃA�v���P�[�V�����B

### �R�}���h�v�����v�g���\������
�����J�̃I�v�V������`SUBSYSTEM`��ύX����K�v������B
���Ԃł͈ȉ��̂悤�ɕύX����ƋL�ڂ�����i[�Q�l](https://qiita.com/awrznc/items/8faea4db2fa1be683d70)�j�B

1. �\�����[�V�����G�N�X�v���[���[����v���W�F�N�g���E�N���b�N��`�v���p�e�B`��I�� or ���j���[�o�[����`�v���W�F�N�g` > `�v���W�F�N�g�̃v���p�e�B`��I��
2. `�\���v���p�e�B`��I��
3. `�����J�[`��I��
4. `�V�X�e��`��I��
5. `�T�u�V�X�e��`��I��
6. `�T�u�V�X�e��`�̒l��`�R���\�[��...`����`Windows...`�ɕύX

�����A`Visual Studio 2022`�ɂȂ��Ă���ݒ���@���ς�����̂��A��L�菇�ł͕ύX�ł��Ȃ������̂ŁA���L�̎菇�ŕύX�����B

1. �\�����[�V�����G�N�X�v���[���[����v���W�F�N�g���E�N���b�N��`�v���p�e�B`��I�� or ���j���[�o�[����`�v���W�F�N�g` > `�v���W�F�N�g�̃v���p�e�B`��I��
2. `�A�v���P�[�V����`��I��
3. `�o�͂̎��`��I��
4. `�o�͂̎��`�̒l��`�R���\�[�� �A�v���P�[�V����`����`Windows �A�v���P�[�V����`�ɕύX

## ���C�u������ǉ�����ꍇ

### �g�ݍ��ݍς݂̃��C�u�����̏ꍇ
- **�\�����[�V�����G�N�X�v���[���[**����v���W�F�N�g��I��
- `�Q��`���E�N���b�N
- `�Q�Ƃ̒ǉ�`��I��
- `�A�Z���u��`��I��
- �K�v�ȃ��C�u�����̃`�F�b�N�{�b�N�X��L����

### ����ȊO�̏ꍇ
- **�\�����[�V�����G�N�X�v���[���[**����v���W�F�N�g���E�N���b�N
- `NuGet�p�b�P�[�W�̊Ǘ�`��I��
- �K�v�ȃ��C�u�������������C���X�g�[��

### ���v���W�F�N�g�̏ꍇ
- **�\�����[�V�����G�N�X�v���[���[**����v���W�F�N�g��I��
- `�Q��`���E�N���b�N
- `�Q�Ƃ̒ǉ�`��I��
- `�v���W�F�N�g`��I��
- �K�v�ȃv���W�F�N�g�̃`�F�b�N�{�b�N�X��L����

## �摜�t�@�C����Base64�ɕϊ�����R�[�h

```C#
Bitmap bitmap = new Bitmap("C:\\work\\html\\iitclogviwer\\images\\CtrlKobe\\ENLIGHTENED.png");
ImageConverter converter = new ImageConverter();
string base64 = Convert.ToBase64String((byte[])converter.ConvertTo(bitmap, typeof(byte[])));
```

## Json
��{�I�ɂ�`System.Json.Text.JsonSerializer`���g�p����B
`JsonSerializer`���g�p���邽�߂ɂ�Json�̃f�[�^��\������f�[�^�^�N���X���K�v�ƂȂ�B

### �f�[�^�^�N���X
Json�̃L�[����Accessor�̃L�[������v������Ǝ�Ԃ��|����Ȃ��B

```json
{
  "person": {
    "name": "yamada",
    "age": 20
  }
}
```

�Ƃ���Json�t�@�C���Ȃ̂ł���΃f�[�^�^�N���X��

```C#
class Data {
  public Person person { get; set; }
}

class Person {
  public string name { get; set; }
  public int age { get; set; }
}
```

�ƂȂ�B
�����A�R�[�f�B���O�K��I��Json��N���X�̃L�[������v���Ȃ��ꍇ�͉��L�̂����ꂩ�̑Ή����s���B

#### Camel�APascal�̍��̏ꍇ
Json�̃L�[���̓L�������P�[�X�A�N���X�̓p�X�J���P�[�X�Ƃ������ꍇ�A�V���A���C�Y���ɃI�v�V�������w�肷�邱�Ƃŉ�������B

```C#
data = JsonSerializer.Deserialize<XBooksData>(jsonString, new JsonSerializerOptions {
  PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
});
```

#### �S���قȂ�ꍇ
�f�[�^�^�ɑ�����t�^���邱�Ƃŉ�������B

```C#
class Person {
  [JsonPropertyName("name")] // ������
  public string fullName { get; set; }
  public int age { get; set; }
}
```

### �ǂݍ���
`JsonSerializer.Deserialize`���g�p����B

```C#
JsonSerializer.Deserialize<Data>(jsonString);
```

### ��������
`JsonSerializer.Serialize`���g�p����B

```C#
string jsonString = JsonSerializer.Serialize(data);
```

�����C���f���g���K�v�Ȃ̂ł���΃I�v�V�����Ŏw�肷��B

```C#
string jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions {
  WriteIndented = true 
});
```


### `JsonSeralizer`���g�p���Ȃ��ꍇ
`System.Json.Text.Nodes.JsonNode`���g�p���Ēn���ɕϊ�����B

```C#
using System.Json.Text.Nodes;

var jsonString = @"{key: value}";
JsonNode root = JsonNode.Parse(jsonString);
string value = (string)root["key"];
```

## �f�[�^�ƃR���g���[���̕R�Â�
`System.Windows.Forms.BindingSource`���g�p����ƕ֗������H
Web��ł�`DataGridView`�ł̃T���v���΂��肾�����̂ŁA����ȊO�Ŏg���͓̂K�؂łȂ��̂�������Ȃ��B

```C#
public class Form1 : Form {
  private BindingSource _bindingSource;

  public Form1() {
    InitializeComponent();
    this._bindingSource = new BindingSource();
    this._bindingSource.DataSource = new Data();
    // Add(�R���g���[���̃v���p�e�B, �R�Â���f�[�^, �f�[�^�̃v���p�e�B)
    this.label1.DataBindings.Add("Text", this._bindingSource, "Name");
  }
}

public class Data {
  public string Name { get; set; }
}
```

�������A��L�̎����ł�`Data.Name`���X�V���ꂽ�Ƃ��Ă��AUI�͍X�V����Ȃ��̂ŉ��L�̂����ꂩ�̑Ή����s���B

### `BindingSource.ResetBindings(bool)`���Ăяo��
�R�Â����Ă���f�[�^���X�V���ꂽ��ɁA`System.Windows.Forms.BindingSource.ResetBindings(bool)`���Ăяo����UI���X�V�����B

```C#
data.name = "update";
this._bindingSource.ResetBindings(false);
```

�����̓f�[�^�\�����ς������`true`�A�ς��Ȃ��Ȃ�`false`�炵���B`true`�͏����d���炵���̂ŁA��{�I�ɂ�`false`���g�������B

### `INotifyPropertyChanged`����������
�R�Â�����f�[�^�N���X��`System.ConponentModel.INotifyPropertyChanged`����������B
`INotifyPropertyChanged`�͒l�̍X�V��m�点��C���^�[�t�F�[�X�B
�f�[�^�N���X�̎������ʓ|�ɂȂ邪�A��������`ResetBindings`���Ăяo�����ɍςނ̂Ŋy�B

```C#
public class Data : INotifyPropertyChanged {

  public event PropertyChangedEventHandler PropertyChanged;

  private void NotifyPropertyChanged([CallerMemberName] string propertyName = "") {
    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
  }

  private string _name;
  public int Name {
    get { return this._name; }
    set {
      if (this._name != value) {
        this._name = value;
        this.NotifyPropertyChanged();
        // name���ς�������Ƃő��̃v���p�e�B�ɕω�������ꍇ�͈ꏏ�ɃC�x���g�𔭐������Ă��悢
        // this.NotifyPropertyChanged("fullName"); // �t���l�[�����X�V���ꂽ���Ƃ�m�点��
      }
    }
  }
}
```