import { API_URL } from "../constants";
import IFoodItem from "../item-builder/IFoodItem";
export type FoodGridObserver = ((items: FoodGrid | undefined) => void) | null;

export type FoodGrid = {
  groups: FoodGroup[];
};

export type FoodGroup = {
  name: string;
  id: number;
  items?: IFoodItem[];
};

export class Observer {
  public items: FoodGrid | undefined;
  private observers: FoodGridObserver[] = [];

  constructor() {
    this.fetchItems();
  }

  public async fetchItems() {
    const res = await fetch(API_URL + "/fooditem/me", {
      mode: "cors",
      credentials: "include",
      method: "GET",
    });
    if (res.status !== 200) return;
    const data = await res.json();
    
    this.items = {
      groups: [
        {
          name: "Ungroupped",
          id: 0,
          items: data.items,
        },
      ],
    };

    this.emitChange();
  }

  public createNewGroup() {
    // Find the highest id and add one to it

    if (!this.items) return;
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

    if (!this.items) return;

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
    if (!this.items) return;

    this.items.groups = this.items.groups?.map((item) => {
      if (item.id === id && item.name !== "Ungroupped") {
        item.name = name;
      }
      return item;
    });

    this.emitChange();
  }

  public subscribe(o: FoodGridObserver): void {
    this.observers.push(o);
    this.emitChange();
  }

  public moveItemIntoGroup(itemId: number, groupId: number) {
    if (!this.items) return;

    const group = this.items.groups?.filter(
      (group) =>
        group.items?.filter((item) => item.FoodID === itemId).length !== 0
    );

    if (group) {
      let itemToAdd = group[0]?.items?.filter(
        (item) => item.FoodID === itemId
      )[0];
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
          group.items = group.items?.filter((item) => item.FoodID !== itemId);
        } else {
          // We're in the same group
          const res: IFoodItem[] = [];
          group.items?.forEach((item) => {
            const i = res.findIndex((x) => x.FoodID === item.FoodID);

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
    if (this.items) {
      /* @ts-ignore */
      this.observers.forEach((o) => o && o({ ...this.items }));
    }
  }
}
