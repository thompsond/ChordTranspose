import {ComponentHarness} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';

export class AppHarness extends ComponentHarness {
    static hostSelector = 'app-root';

    inputTextArea = MatInputHarness.with({selector: '#input-textarea'});
    outputTextArea = MatInputHarness.with({selector: '#output-textarea'});
    transposeButton = MatButtonHarness.with({selector: '.transpose-btn'});
    useFlatsButton = MatSlideToggleHarness.with({selector: '#use-flats-btn'});
    transposeValue = this.locatorFor('.transpose-value');
    decreaseTransposeButton = this.locatorFor('.decrease');
    increaseTransposeButton = this.locatorFor('.increase');
}