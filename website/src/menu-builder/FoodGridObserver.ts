import IFoodItem from "../item-builder/IFoodItem";
export type FoodGridObserver = ((items: FoodGrid) => void) | null;

export type FoodGrid = {
  groups: FoodGroup[];
};

export type FoodGroup = {
  name: string;
  id: number;
  items?: IFoodItem[];
};

export class Observer {
  public items: FoodGrid;
  private observers: FoodGridObserver[] = [];

  constructor() {
    this.items = {
      groups: [
        {
          name: "asdf",
          items: [
            {
              id: 1,
              name: "Quokka",
              shortName: "Quokka",
              price: 2.99,
            },
          ],
          id: 1,
        },
        {
          name: "Ungroupped",
          id: 2,
          items: [
            {
              id: 2,
              name: "Wine 'n beer",
              shortName: "Wine 'n beer",
              price: 6.99,
            },
          ],
        },
      ],
    };
  }

  public createNewGroup() {
    // Find the highest id and add one to it

    const max =
      this.items.groups?.reduce((max, current) =>
        max.id < current.id ? current : max
      ).id || 1;

    this.items.groups?.push({
      name: "",
      id: max + 1,
    });

    console.log(this.items);

    this.emitChange();
  }

  public updateName(name: string, id: number) {
    this.items.groups = this.items.groups?.map((item) => {
      if (item.id === id && item.name !== "Ungroupped") {
        item.name = name;
      }
      return item;
    });

    this.emitChange();
  }

  public subscribe(o: FoodGridObserver): () => void {
    this.observers.push(o);
    this.emitChange();

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  public moveItemIntoGroup(itemId: number, groupId: number) {
    const group = this.items.groups?.filter(
      (group) => group.items?.filter((item) => item.id === itemId).length !== 0
    );

    if (group) {
      let itemToAdd = group[0]?.items?.filter((item) => item.id === itemId)[0];
      // We couldn't find the item so do nothign
      if (itemToAdd) {
        // Move the item into the group
        this.items.groups = this.items.groups?.map((item) => {
          if (item.id === groupId) {
            item.items?.push(itemToAdd as IFoodItem);
          }
          return item;
        });
      }

      // Get rid of any duplicates

      this.items.groups = this.items.groups?.map((group) => {
        if (group.id !== groupId) {
          group.items = group.items?.filter((item) => item.id !== itemId);
        }
        return group;
      });

      this.emitChange();
    }
  }

  private emitChange() {
    this.observers.forEach((o) => o && o({ ...this.items }));
  }
}
