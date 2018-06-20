import { Component, Prop, State, Event, EventEmitter, Method, Listen } from '@stencil/core';
import '@ionic/core'
import './css-selector'
import { Step } from 'intro.js'
// import { reorderArray } from '@ionic/core'
declare var CssSelectorGenerator: any
const finder = new CssSelectorGenerator


@Component({
  tag: 'lk-walkthrough-creator',
  styleUrl: 'walkthrough_creator.component.scss',
  shadow: false
})

export class WalkthroughCreatorComponent {
  @Prop() contentId: string
  @Prop({mutable: true}) menu: any
  @Event() update: EventEmitter

  @State() items: Step[] = []
  @State() itemToChooseElementFor: Step
  @State() elementInFocus: HTMLElement

  private activeElement: HTMLElement

  @Listen('body:contextmenu')
  onClick(event) {
    if (!this.items[0] || !this.menu.isOpen()) {
      return
    }
    if (!this.itemToChooseElementFor) {
      this.itemToChooseElementFor = this.items[0]
    }
    const element = event.target as HTMLElement
    this.itemToChooseElementFor.element = finder.getSelector(element)
    element.classList.add('selected-for-step')
    event.preventDefault()
    event.stopPropagation()
    if (this.elementInFocus) {
      this.elementInFocus.classList.remove('selected-for-step')
    }
    this.elementInFocus = element
    if (this.activeElement) {
      this.activeElement.focus()
    }
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

  updateIntro(event, item) {
    item.intro = event.target.value
  }

  @Method()
  init(steps: any) {
    this.items = steps.slice(0)
  }

  done() {
    const savedItems = this.items.filter((item) => item.intro)
    if (savedItems.length) {
      this.update.emit(savedItems)
    }
  }

  onFocusItem(item, event) {
    this.activeElement = event.target
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

  removeElement(item: Step) {
    const element = document.querySelector(item.element as string)
    if (element) {
      element.classList.remove('selected-for-step')
    }
    item.element = null
    delete this.elementInFocus
  }

  updateMenuRef(el: any) {
    this.menu = el
  }

  render() {
    return (
    <section>
      <ion-menu contentId={this.contentId} ref={this.updateMenuRef.bind(this)} type="push">
        <ion-header>
          <ion-toolbar>
            <ion-title>Walkthrough Creator</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
        <ion-list>
            {
              this.items.map((item, index) => (
                  <ion-card class={item === this.itemToChooseElementFor ? 'focused-element': ''}>
                    <ion-item>
                      <ion-label  position="stacked">Intro</ion-label>
                      <ion-input
                        clearInput
                        type="text"
                        placeholder="Add <em>Intro</em>"
                        onChange={ev => this.updateIntro(ev, item)}
                        onFocus={(ev) => this.onFocusItem(item, ev)}
                        onClick={(ev) => this.onFocusItem(item, ev)}
                        value={item.intro}>
                      </ion-input>
                    </ion-item>
                    { item.element &&
                      <ion-item>
                        <ion-label>Attached to element</ion-label>
                        <ion-checkbox checked onChange={() => this.removeElement(item)}></ion-checkbox>
                      </ion-item>
                  
                    }
                  <div class="delete-button">
                      <ion-button onClick={() => this.removeStep(index)} fill="clear" color="danger"  size="small">
                        X
                      </ion-button>
                  </div>
                </ion-card>
                ))
            }
        </ion-list>
        </ion-content>
        <div class="menu-buttons">
          <ion-button onClick={() => this.addStep()} color="secondary">Add a step</ion-button>
          <ion-button onClick={() => this.done()} color="primary">Done</ion-button>
        </div>
      </ion-menu>

    </section>
    );
  }
}
