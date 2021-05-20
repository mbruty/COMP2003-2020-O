import { API_URL } from "../constants";
import IFoodItem from "../item-builder/IFoodItem";
export type MenuObservers = ((menus: Menu[]) => void) | null;

export type Menu = {
  MenuName: string;
  MenuID: number;
  FoodItems?: IFoodItem[];
  servingDays: string[];
  servingTime?: Date;
  servingFor?: number;
  isLive: boolean;
};

export class MenuObserver {
  public menus: Menu[];
  private observers: MenuObservers[] = [];

  constructor(data: any) {
    if (data) {
      this.menus = data.menus;
    } else {
      this.menus = [];
    }
  }

  public async removeFromMenu(itemId: number, menuId: number) {
    // Update db with removed link
    const res = await fetch(API_URL + "/menu/unlinkfooditem", {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        FoodID: itemId,
        MenuID: menuId,
      }),
    });
    if (res.status !== 200) return;
    this.menus = this.menus.map((menu) => {
      if (menu.MenuID !== menuId) return menu;
      // Will always be true, just satisfying the ts compiler
      if (menu.FoodItems) {
        menu.FoodItems = menu.FoodItems.filter(
          (item) => item.FoodID !== itemId
        );
      }
      return menu;
    });

    this.emitChange();
  }

  public async moveItemIntoGroup(item: IFoodItem, menuId: number) {
    // Update the db with the new item
    const res = await fetch(API_URL + "/menu/linkfooditem", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        FoodID: item.FoodID,
        MenuID: menuId,
      }),
    });
    if (res.status !== 200) return;
    this.menus = this.menus.map((menu) => {
      if (menu.MenuID !== menuId) return menu;

      if (menu.FoodItems) {
        menu.FoodItems = [...menu.FoodItems, item];
      } else {
        menu.FoodItems = [item];
      }
      return menu;
    });

    this.menus = this.menus.map((menu) => {
      if (menu.MenuID === menuId && menu.FoodItems) {
        // If this the array that has been FoodItems into
        // Filter the items so they're only unique
        const res: IFoodItem[] = [];
        menu.FoodItems?.forEach((item) => {
          const i = res.findIndex((x) => x.FoodID === item.FoodID);
          if (i === -1) res.push(item);
        });
        console.log(res);

        menu.FoodItems = res;
      }
      return menu;
    });

    this.emitChange();
  }
  public async createNewMenu(menuName: string, id: number) {
    // Create the menu
    const response = await fetch(API_URL + "/menu/create", {
      method: "POST",
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({
        RestaurantID: id,
        IsChildMenu: false,
        MenuName: menuName,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      const menuID = data.menu.MenuID;
      console.log(data);

      // Link the menu to the restaurant

      const res = await fetch(API_URL + "/menu/linkrestaurant", {
        method: "POST",
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          RestaurantID: id,
          MenuID: menuID,
          AlwaysServe: false,
          IsActive: false,
        }),
      });

      // Successfully linked
      if (res.status === 200) {
        this.menus.push({
          MenuName: menuName,
          MenuID: menuID,
          servingDays: ["None set"],
          isLive: false,
          FoodItems: [],
        });
      }

      this.emitChange();
    } else {
      throw new Error("Couldn't create");
    }
  }

  public subscribe(o: MenuObservers): () => void {
    this.observers.push(o);
    this.emitChange();

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  private emitChange() {
    if (this.menus) {
      this.observers.forEach((o) => o && o([...this.menus]));
    }
  }
}
