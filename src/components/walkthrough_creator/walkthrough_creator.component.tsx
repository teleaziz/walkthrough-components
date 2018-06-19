import { Component, Prop, Watch, State, Listen, Event, EventEmitter } from '@stencil/core';
import '@ionic/core'
import finder from '@medv/finder'
import { Step } from 'intro.js'

@Component({
  tag: 'lk-walkthrough-creator',
  styleUrl: 'walkthrough_creator.component.scss',
  shadow: false
})
export class WalkthroughCreatorComponent {
  @Prop() contentId: string
  @Prop({mutable: true}) split = false
  @State() when = 'xl' ;
  @State() elementInFocus: HTMLElement
  @State() items: Step[] = []
  @Event() update: EventEmitter

  menu: any

  @Watch('split')
  splitChanged(split) {
    this.when = split ? 'xs' : 'xl'
  }

  @Listen('body:click')
  onClick(event: UIEvent) {
    this.elementInFocus = event.target as HTMLElement
    console.log(finder(this.elementInFocus))
  }

  onReorder(indexes) {
    console.log(indexes, 'he')
    // this.items = reorderArray(this.items, indexes)
  }

  addStep(step: Step) {
    this.items = this.items.concat(step)
  }


  render() {
    return (
    <ion-split-pane when={this.when}>
      <section class="focus" main id="split">
        <slot name="split-content"></slot>
      </section>
      <ion-menu ref={(el) => this.menu = el as HTMLIonMenuElement }type="push" contentId="split">
        <ion-header>
            <ion-toolbar>
            <ion-title>Walkthrough Creator</ion-title>
            </ion-toolbar>
        </ion-header>
      </ion-menu>

    </ion-split-pane>
    );
  }
}
