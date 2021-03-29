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
          name: "Amazing dinner",
          items: [
            {
              id: 1,
              name: "Quokka",
              shortName: "Quokka",
              price: 2.99,
            },
            { id: 3, shortName: "Borger", name: "Borger", price: 69.69 },
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
            {
              id: Number.MAX_SAFE_INTEGER,
              name: "Error test",
              shortName: "Error test",
              price: 0.01,
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
      name: "Unnamed group",
      id: max + 1,
      items: [],
    });

    this.emitChange();
  }

  public removeGroup(id: number) {
    let group: any, ungroupped: any;
    let otherGroups: FoodGroup[] = [];

    this.items.groups.forEach((x) => {
      if (x.id === id) {
        group = x;
      } else if (x.name === "Ungroupped") {
        ungroupped = x;
      } else {
        otherGroups.push(x);
      }
    });

    if (!group || !otherGroups) {
      // Oopsie doopsie something's gone very wrong
      return;
    }

    // Set the items to a coppy of other groups
    this.items.groups = [...otherGroups];

    // Create a new array that contains all of the ungrouped items, appended with the removed group items
    ungroupped.items = [...ungroupped.items, ...group.items];
    this.items.groups.push(ungroupped);
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
        // If we're looking at a different group than what the item has been dragged into
        if (group.id !== groupId) {
          group.items = group.items?.filter((item) => item.id !== itemId);
        } else {
          // We're in the same group
          const res: IFoodItem[] = [];
          group.items?.forEach((item) => {
            const i = res.findIndex((x) => x.id === item.id);
            console.log(i);

            if (i <= -1) res.push(item);
          });
          group.items = res;
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
