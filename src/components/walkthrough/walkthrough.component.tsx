import { Component, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { IntroJs, Options } from 'intro.js';

@Component({
  tag: 'lk-walkthrough',
  styleUrl: 'walkthrough.component.scss',
  shadow: false
})
export class WalkthroughComponent {

  @Prop() show: boolean
  @Prop() options: Options
  @Event() introEvent: EventEmitter

  @State() intro: IntroJs

  private events = ['exit', 'change', 'beforechange', 'afterchange', 'complete']

  onScriptLoad() {
    this.intro = introJs()
    this.intro.setOptions(this.options)
    this.onShow(this.show)
    this.events
    .forEach(eventName => this.intro[`on${eventName}`](this.emitEvent.bind(this, eventName)))

  }

  emitEvent(name) {
    this.introEvent.emit(name)
  }

  @Watch('show')
  onShow(newVal) {
    if (!this.intro) {
      return
    }

    if (newVal) {
      this.intro.start()
    } else {
      this.intro.exit()
    }
  }

  render() {
    console.log('here', this.options)
    return (
      <section>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intro.js@2.9.3/introjs.min.css" type="text/css"/>
        <script
          onLoad={() => this.onScriptLoad()}
          crossorigin="" src="https://cdn.jsdelivr.net/npm/intro.js@2.9.3/intro.min.js"></script>
      </section>
    );
  }
}
