import { BehaviorSubject } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface ChordParts {
  readonly note: string;
  readonly modifiers: string;
}

/** Representation of a chord list and the index where a particular chord was found. */
interface ChordListResult {
  chordList: string[];
  index: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly sharpsList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  private readonly flatsList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  readonly INCREASE_IDENTIFIER = 'increase';
  readonly DECREASE_IDENTIFIER = 'decrease';
  inputChordsFormControl = new FormControl('');
  outputChordsFormControl = new FormControl('');
  useFlatsFormControl = new FormControl(false);
  transposeValue$ = new BehaviorSubject(1);
  // Whether the next valid line of text is expected to be chord names
  isChordLine = true;

  onTranspose() {
    this.isChordLine = true;
    const lines = this.inputChordsFormControl.value?.split('\n') ?? [];
    const newLines: string[] = [];
    let prevChar = ' ';
    let newLine = '';
    let newChord = '';
    const transposeValue = this.transposeValue$.getValue();
    const useFlats = this.useFlatsFormControl.value ?? false;

    for (const line of lines) {
      // Section name lines or empty lines
      if (line.includes('[') || line.trim() === '') {
        newLines.push(line);
        continue;
      }
      // Lyric lines
      if (!this.isChordLine) {
        newLines.push(line);
        this.isChordLine = true;
        continue;
      }
      for (const chord of line.split(' ')) {
        if (chord.includes('/')) {
          const result = chord.split('/');
          const [left, right] = result;
          const leftChordParts = this.parseChord(left);
          const leftListResult = this.getListResult(leftChordParts.note, useFlats);
          const rightChordParts = this.parseChord(right);
          const rightListResult = this.getListResult(rightChordParts.note, useFlats);
          newChord = (leftListResult && rightListResult) ?
            this.calculateTransposedValue(transposeValue, leftListResult)
              + leftChordParts.modifiers + '/'
              + this.calculateTransposedValue(transposeValue, rightListResult)
              + rightChordParts.modifiers
            : ' ';
        }
        else {
          const chordParts = this.parseChord(chord);
          const chordListResult = this.getListResult(chordParts.note, useFlats);
          // Get the new chord if it is recognized, otherwise return the current chord
          newChord = chordListResult ? this.calculateTransposedValue(transposeValue, chordListResult)
            + chordParts.modifiers
          : (chord === '' ? ' ' : chord);
        }
        // Add a space to the line if the last character was not a space. This usually happens if two chords are
        // separated by a single space and the space won't exist in `line.split`
        if (newLine.length > 0 && newLine[newLine.length-prevChar.length] !== ' ') newLine += ' ';
        newLine += newChord;
        prevChar = newChord;
        newChord = '';
      }
      newLines.push(newLine);
      newLine = '';
      this.isChordLine = false;
    }
    this.outputChordsFormControl.reset();
    this.outputChordsFormControl.setValue(newLines.join('\n'));
  }

  /** Returns the correct note list */
  getListResult(chord: string, useFlats: boolean): ChordListResult|null {
    for (const list of [this.flatsList, this.sharpsList]) {
      if (list.includes(chord)) {
        return {
          chordList: useFlats ? this.flatsList : this.sharpsList,
          index: list.indexOf(chord),
        };
      }
    }
    return null;
  }

  /** Gets the transposed note */
  calculateTransposedValue(transposeValue: number, result: ChordListResult): string {
    const initialChordPos = result.index;
    const listToCheck = result.chordList;
    if (initialChordPos === -1) {
      return ' ';
    }
    let newChordPos = (initialChordPos + transposeValue);
    if ((initialChordPos + transposeValue) > (listToCheck.length - 1)) {
      newChordPos -= listToCheck.length;
    }
    return listToCheck[newChordPos];
  }

  /** Splits a chord into the root note and its modifiers. */
  parseChord(value: string): ChordParts {
    const regexList = [/[A-Z]\#/, /[A-Z]b/];
    for (const regex of regexList) {
      if (regex.test(value)) {
        return regex.exec(value)!.map((note): ChordParts => {
          return {note, modifiers: value.substring(note.length)};
        })[0];
      }
    }
    return {note: value[0], modifiers: value.substring(1)};
  }

  /** Event handler for changing the transpose number. */
  onChangeTransposeValue(operation: string) {
    const currentValue = this.transposeValue$.getValue();
    if (operation === this.INCREASE_IDENTIFIER && currentValue < 11) {
      this.transposeValue$.next(currentValue === -1 ? (currentValue + 2) : (currentValue + 1));
    }
    if (operation === this.DECREASE_IDENTIFIER && currentValue > -11) {
      this.transposeValue$.next(currentValue === 1 ? (currentValue - 2) : (currentValue - 1));
    }
  }
}
