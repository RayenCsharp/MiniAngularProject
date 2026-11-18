import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countdown' })
export class CountdownPipe implements PipeTransform {
  transform(value: Date | undefined): string {
    if (!value) return '';

    const end = new Date(value);
    end.setHours(23, 59, 59, 999);

    const days = Math.floor((end.getTime() - Date.now()) / 86400000); // 86400000 ms in a day

    if (days < 0) return 'Deadline reached';
    if (days === 0) return 'Last day';
    return days === 1 ? '1 day left' : days + ' days left';
  }
}
