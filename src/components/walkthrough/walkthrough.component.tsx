import { Component, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { IntroJs, Options } from 'intro.js';

@Component({
  tag: 'lk-walkthrough',
  styleUrl: 'walkthrough.component.scss',
  shadow: false
})
export class WalkthroughComponent {

  @Prop() modern: boolean
  @Prop() options: Options
  @Event() introEvent: EventEmitter

  @State() intro: IntroJs

  private events = ['exit', 'change', 'beforechange', 'afterchange', 'complete']

  onScriptLoad() {
    this.intro = introJs()
    this.events
    .forEach(eventName => this.intro[`on${eventName}`](this.emitEvent.bind(this, eventName)))

  }

  emitEvent(name) {
    this.introEvent.emit(name)
  }

  @Method()
  start(options= this.options) {
    if (this.intro) {
      this.intro.setOptions(options)
      this.intro.start()
    }
  }


  @Method()
  stop() {
    if (this.intro) {
      this.intro.exit()
    }
  }

  render() {
    return (
      <section>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intro.js@2.9.3/introjs.min.css" type="text/css"/>
        { this.modern && <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intro.js@2.9.3/themes/introjs-modern.css" type="text/css"/>}
        <script
          onLoad={() => this.onScriptLoad()}
          crossorigin="" src="https://cdn.jsdelivr.net/npm/intro.js@2.9.3/intro.min.js"></script>
      </section>
    );
  }
}
