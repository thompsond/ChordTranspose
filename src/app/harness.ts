import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';

export class AppHarness extends ComponentHarness {
    static hostSelector = 'app-root';

    readonly inputTextArea = this.locatorFor(MatInputHarness.with({selector: '#input-textarea'}));
    readonly outputTextArea = this.locatorFor(MatInputHarness.with({selector: '#output-textarea'}));
    readonly useFlatsButton = this.locatorFor(MatSlideToggleHarness.with({selector: '#use-flats-btn'}));
    readonly transposeValue = this.locatorFor('.transpose-value');
    readonly decreaseTransposeButton = this.locatorFor(MatButtonHarness.with({selector: '.decrease'}));
    readonly increaseTransposeButton = this.locatorFor(MatButtonHarness.with({selector: '.increase'}));
}