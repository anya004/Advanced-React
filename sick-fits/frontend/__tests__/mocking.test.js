function Person(name, foods) {
    this.name = name;
    this.foods = foods;
  }
  
  Person.prototype.fetchFavFoods = function() {
    return new Promise((resolve, reject) => {
      //Simulate an API
      setTimeout(() => resolve(this.foods), 2000);
    });
  };
  
  describe('mocking learning', () => {
    it('mocks a reg function', () => {
      const fetchDogs = jest.fn();
      fetchDogs('Snickers');
      expect(fetchDogs).toHaveBeenCalled();
      expect(fetchDogs).toHaveBeenCalledWith('Snickers');
      fetchDogs('Hugo');
      expect(fetchDogs).toHaveBeenCalledTimes(2);
    });
  
    it('can create a person', () => {
      const me = new Person('Annaa', ['banana', 'pad thai']);
      expect(me.name).toBe('Annaa');
    });
  
    it('can fetch foods', async () => {
      const me = new Person('Anya', ['fruits', 'smoothie']);
      //mock the favFoods function
      me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'wood oven baked pizzzza']);
      const favFoods = await me.fetchFavFoods();
      console.log(favFoods);
      expect(favFoods).toContain('sushi');
    });
  });