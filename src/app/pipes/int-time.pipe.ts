import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "intTime",
})
export class IntTimePipe implements PipeTransform {
  transform(value: any): any {
    const d = new Date(1586304722710);
    return d.toLocaleTimeString();
  }
}
