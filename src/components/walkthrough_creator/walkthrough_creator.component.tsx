import { Component, Prop, Watch, State, Event, EventEmitter, Method } from '@stencil/core';
import '@ionic/core'
import './css-selector'
import { Step } from 'intro.js'
// import { reorderArray } from '@ionic/core'
declare var CssSelectorGenerator: any
const finder = new CssSelectorGenerator

export interface ExtendedStep extends Step {
  isInFocus?: boolean;
  isSaved?: boolean;
}

@Component({
  tag: 'lk-walkthrough-creator',
  styleUrl: 'walkthrough_creator.component.scss',
  shadow: false
})

export class WalkthroughCreatorComponent {
  @Prop() contentId: string
  @Prop({mutable: true}) split = false
  @State() when = '' ;
  @State() items: ExtendedStep[] = []
  @Event() update: EventEmitter

  @State() itemToChooseElementFor: Step
  @State() elementInFocus: HTMLElement

  @Watch('split')
  splitChanged(split) {
    this.when = split ? 'xs' : 'never'
  }

  onClick(event: UIEvent) {
    if (!this.items[0] || !this.split) {
      return
    }
    if (!this.itemToChooseElementFor) {
      this.itemToChooseElementFor = this.items[0]
    }
    const element = event.target as HTMLElement
    this.itemToChooseElementFor.element = finder.getSelector(element)
    element.classList.add('selected-for-step')
    event.preventDefault()
    if (this.elementInFocus) {
      this.elementInFocus.classList.remove('selected-for-step')
    }
    this.elementInFocus = element
  }

  addStep() {
    const newItem = {intro: ''}
    this.items = this.items.concat(newItem)
    if (this.elementInFocus) {
     this.elementInFocus.classList.remove('selected-for-step')
     this.elementInFocus = null
    }
    this.itemToChooseElementFor = newItem
  }

  removeStep(index: number) {
    this.itemToChooseElementFor = null
    this.items = [
      ...this.items.slice(0, index),
      ...this.items.slice(index + 1)
    ]
  }

  saveStep(step: ExtendedStep) {
    step.isSaved = true
  }

  isSaved(item: ExtendedStep) {
    return item.isSaved
  }

  updateIntro(event, item) {
    item.intro = event.target.value
  }

  @Method()
  init(steps: any) {
    this.items = steps.map(step => ({
      ...step,
      isSaved: true
    }))
  }

  done() {
    const savedItems = this.items.filter((item) => item.isSaved)
    if (savedItems.length) {
      this.update.emit(savedItems)
    }
  }

  onFocusItem(item) {
    this.itemToChooseElementFor = item
    if (this.elementInFocus) {
      this.elementInFocus.classList.remove('selected-for-step')
      this.elementInFocus = null
    }
    if (item.element) {
      this.elementInFocus = document.querySelector(item.element)
      if (this.elementInFocus) {
        this.elementInFocus.classList.add('selected-for-step')
      }
    }
  }

  removeElement(item: ExtendedStep) {
    const element = document.querySelector(item.element as string)
    if (element) {
      element.classList.remove('selected-for-step')
    }
    item.element = null
    delete this.elementInFocus
  }

  render() {
    return (
    <ion-split-pane when={this.when}>
      <section onClick={(ev) => this.onClick(ev)} class={this.split ? 'focus' : ''} main id="split">
        <slot name="split-content"></slot>
      </section>
      <ion-menu type="push">
        <ion-header>
          <ion-toolbar>
            <ion-title>Walkthrough Creator</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
        <ion-list>
            {
              this.items.map((item, index) => (
                  <ion-item-group>
                    <ion-item>
                    <ion-label  position="stacked">Intro</ion-label>
                    <ion-input
                      clearInput
                      type="text"
                      placeholder="Add <em>Intro</em>"
                      onChange={ev => this.updateIntro(ev, item)}
                      onFocus={() => this.onFocusItem(item)}
                      onClick={() => this.onFocusItem(item)}
                      onBlur={() => this.saveStep(item)}
                      value={item.intro}>
                    </ion-input>
                    </ion-item>
                    { item.element &&
                      <ion-item>
                        <ion-label class={item === this.itemToChooseElementFor ? 'focused-element': ''}>Attached to element</ion-label>
                        <ion-checkbox checked onChange={() => this.removeElement(item)}></ion-checkbox>
                      </ion-item>
                  
                    }
                    <div class="menu-buttons">
                      <ion-button expand="full" color="danger" onClick={() => this.removeStep(index)}>remove</ion-button>
                      <ion-button expand="full" onClick={() => this.saveStep(item)}>save</ion-button>
                    </div>
                  </ion-item-group>
                ))
            }
        </ion-list>
        </ion-content>
        <div class="menu-buttons">
          <ion-button onClick={() => this.addStep()} color="secondary">Add a step</ion-button>
          <ion-button onClick={() => this.done()} color="primary">Done</ion-button>
        </div>
      </ion-menu>

    </ion-split-pane>
    );
  }
}
