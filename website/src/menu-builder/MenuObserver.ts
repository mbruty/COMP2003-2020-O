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

  public removeFromMenu(itemId: number, menuId: number) {
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

  public moveItemIntoGroup(item: IFoodItem, menuId: number) {
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
  public createNewMenu() {
    this.menus.push({
      MenuName: "Un-named menu",
      MenuID:
        this.menus.reduce((p, c) => (p.MenuID < c.MenuID ? c : p)).MenuID + 1,
      servingDays: ["None set"],
      isLive: false,
      FoodItems: [],
    });

    this.emitChange();
  }

  public subscribe(o: MenuObservers): () => void {
    this.observers.push(o);
    this.emitChange();

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  private emitChange() {
    this.observers.forEach((o) => o && o([...this.menus]));
  }
}
