import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppHarness } from './harness';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';

describe('AppComponent', () => {
  let state: {
    component: AppComponent,
    fixture: ComponentFixture<AppComponent>,
    harness: AppHarness,
    loader: HarnessLoader,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, AppHarness);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    state = {
      component,
      fixture,
      harness,
      loader,
    };
  });

  it('should create the app', () => {
    expect(state.component).toBeTruthy();
  });

  it('should correctly transpose 1 step', async () => {
    const inputTextArea = await state.loader.getHarness(state.harness.inputTextArea);
    await inputTextArea.setValue('[Verse 1]\nA B C C#\nPizza');
    const transposeButton = await state.loader.getHarness(state.harness.transposeButton);
    await transposeButton.click();
    const outputTextArea = await state.loader.getHarness(state.harness.outputTextArea);
    expect(await outputTextArea.getValue()).toBe('[Verse 1]\nA# C C# D\nPizza');
  });

  it('should correctly change from sharps to flats', async () => {
    const useFlatsButton = await state.loader.getHarness(state.harness.useFlatsButton);
    expect(await useFlatsButton.isChecked()).toEqual(false);
    await useFlatsButton.check();
    expect(await useFlatsButton.isChecked()).toEqual(true);
    const inputTextArea = await state.loader.getHarness(state.harness.inputTextArea);
    await inputTextArea.setValue('[Verse 1]\nA B C C#\nPizza');
    const transposeButton = await state.loader.getHarness(state.harness.transposeButton);
    await transposeButton.click();
    const outputTextArea = await state.loader.getHarness(state.harness.outputTextArea);
    expect(await outputTextArea.getValue()).toBe('[Verse 1]\nBb C Db D\nPizza');
  });

  describe('transpose buttons', () => {
    it('should correctly change transpose value', async () => {
      const transposeValue = await state.harness.transposeValue();
      expect(await transposeValue.text()).toEqual('1');
      const decreaseTransposeButton = await state.harness.decreaseTransposeButton();
      const increaseTransposeButton = await state.harness.increaseTransposeButton();
      await decreaseTransposeButton.click();
      expect(await transposeValue.text()).toEqual('-1');
      await increaseTransposeButton.click();
      await increaseTransposeButton.click();
      expect(await transposeValue.text()).toEqual('2');
    });
  });
});
