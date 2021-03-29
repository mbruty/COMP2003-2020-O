import IFoodItem from "../item-builder/IFoodItem";
export type MenuObservers = ((menus: Menu[]) => void) | null;

export type Menu = {
  name: string;
  id: number;
  items?: IFoodItem[];
  servingDays: string[];
  servingTime?: Date;
  servingFor?: number;
  isLive: boolean;
};

export class MenuObserver {
  public menus: Menu[];
  private observers: MenuObservers[] = [];

  constructor() {
    this.menus = [
      {
        name: "Brutylicous Foods",
        id: 1,
        servingDays: ["Monday", "Tuesday"],
        servingTime: new Date(),
        servingFor: 2.5,
        isLive: false,
        items: [
          {
            id: 3,
            shortName: "Borger",
            name: "Borger",
            price: 69.69,
          },
        ],
      },
    ];
  }

  public removeFromMenu(itemId: number, menuId: number) {
    this.menus = this.menus.map((menu) => {
      if (menu.id !== menuId) return menu;
      // Will always be true, just satisfying the ts compiler
      if (menu.items) {
        menu.items = menu.items.filter((item) => item.id !== itemId);
      }
      return menu;
    });

    this.emitChange();
  }

  public moveItemIntoGroup(item: IFoodItem, menuId: number) {
    this.menus = this.menus.map((menu) => {
      if (menu.id !== menuId) return menu;
      if (menu.items) {
        menu.items = [...menu.items, item];
      } else {
        menu.items = [item];
      }
      return menu;
    });

    this.menus = this.menus.map((menu) => {
      if (menu.id === menuId && menu.items) {
        // If this the array that has been dropped into
        // Filter the items so they're only unique
        const res: IFoodItem[] = [];
        menu.items?.forEach((item) => {
          const i = res.findIndex((x) => x.id === item.id);
          console.log(i);

          if (i <= -1) res.push(item);
        });
        menu.items = res;
      }
      return menu;
    });

    this.emitChange();
  }
  public createNewMenu() {
    this.menus.push({
      name: "Un-named menu",
      id: this.menus.reduce((p, c) => (p.id < c.id ? c : p)).id + 1,
      servingDays: ["None set"],
      isLive: false,
      items: [],
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
