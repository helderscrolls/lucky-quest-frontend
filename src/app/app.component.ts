import { KeyValuePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, KeyValuePipe],
  template: `
    <router-outlet />
    <p>Initial Lucky number: {{ luckyNumber() }}</p>

    <form
      [formGroup]="guessForm"
      (ngSubmit)="postGuess(guessForm.getRawValue())"
    >
      @for (control of guessForm.controls | keyvalue; track control.key) {
      <div>
        <label [for]="control.key">{{ control.key }}</label>
        <input
          [id]="control.key"
          type="number"
          [formControlName]="control.key"
        />
      </div>
      }
      <button type="submit">Submit Guess</button>
      <p>{{ postGuessResponse() }}</p>
    </form>
  `,
  styles: [],
})
export class AppComponent {
  private http = inject(HttpClient);
  private formBuilder = inject(FormBuilder);

  guessForm = this.formBuilder.nonNullable.group({
    guess: [0],
  });

  luckyNumber: Signal<number | undefined> = toSignal(
    this.http.get<number>('http://localhost:3000')
  );

  postGuessResponse: WritableSignal<string> = signal('');

  postGuess(guess: { guess: number }) {
    return this.http
      .post<{ result: string }>('http://localhost:3000', guess)
      .subscribe((res) => this.postGuessResponse.set(res.result));
  }
}
