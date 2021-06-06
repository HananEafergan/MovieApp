import { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
    transform(value: string): string {
        return value.toLowerCase();
    }

}