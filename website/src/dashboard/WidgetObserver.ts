import { Widgets } from "../Home";

export type WidgetObserver = ((widgets: Widgets[]) => void) | null;

export class Observer {
  private backup: Widgets[] = [];
  public widgets: Widgets[] = [];
  private observers: WidgetObserver[] = [];

  public subscribe(o: WidgetObserver): () => void {
    this.observers.push(o);
    this.emitChange();

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o);
    };
  }

  public updateBackup(): void {
    this.backup = [...this.widgets];
  }

  public revertToBackup(): void {
    this.widgets = [...this.backup];
    this.emitChange();
  }

  public save(): void {
    this.backup = [];
    // todo send to the backend to save
  }

  public alreadyContainsWidget(widget: Widgets): boolean {
    return this.widgets.includes(widget);
  }

  public moveWidget(newArray: Widgets[]): void {
    this.widgets = newArray.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.emitChange();
  }

  public addWidget(newWidget: Widgets): void {
    const tempCopy = [...this.widgets];
    tempCopy.push(newWidget);
    this.widgets = tempCopy.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    this.emitChange();
  }

  public removeWidget(toRemove: Widgets): void {
    this.widgets = this.widgets.filter((widget) => widget !== toRemove);
    this.emitChange();
  }

  private emitChange() {
    this.observers.forEach((o) => o && o(this.widgets));
  }
}
