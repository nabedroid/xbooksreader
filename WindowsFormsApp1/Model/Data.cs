
namespace WindowsFormsApp1.Model {

  public class Data {

    private ObservableDictionary<string, Character> _characters;

    public Data() {
      _characters = new ObservableDictionary<string, Character>();
    }

    public ObservableDictionary<string, Character> Characters {
      get { return _characters; }
      set {
        _characters = value;
      }
    }

    public void Add(Character character) {
      _characters.Add(character.Id, character);
    }

    public void Remove(Character character) {
      _characters.Remove(character.Id);
    }

  }

}
