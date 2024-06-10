import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../../services/events.service';
import { EventStructure } from './eventStructure';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  providers: [EventsService, DatePipe],
})
export class CalendarComponent {
  events: EventStructure[] = [];

  constructor(
    private eventsService: EventsService,
    private datePipe: DatePipe
  ) {}

  handleDateClick(arg: any) {
    this.getData(arg);
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    locale: esLocale,
    selectable: true,
    events: [],
  };

  getData(arg: any) {
    this.eventsService.getEventByDay(arg.dateStr).subscribe({
      next: (data) => {
        this.events = data;
        this.events.map((evento) => {
          evento.start = this.formatDate(evento.startsAt);
          evento.finish = this.formatDate(evento.finishesAt);
          evento.startDate = this.formatDateTitle(evento.startsAt);
        });
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  formatDate(date: Date): string {
    return `${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(
      date
    )
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  formatDateTitle(date: Date): string {
    const options = { day: 'numeric', month: 'long' };
    const locale = 'es-ES';
    return this.datePipe.transform(new Date(date), 'dd MMMM', 'es-ES') || '';
  }
}
