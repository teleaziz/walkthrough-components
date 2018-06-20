import { Component, State } from '@stencil/core';
import { Options } from 'intro.js'

@Component({
  tag: 'lk-playground',
})
export class PlaygroundComponent {
   @State() options: Options
   tour: any
   creator: any
   componentDidLoad() {
    this.creator.init([
        { 
          intro: "Hit Ctrl on any element on the right to attach this step to it"
        },
        { 
          intro: "You <b>don't need</b> to define element to focus, this is a floating tooltip."
        },
        {
          element: '#step1',
          intro: "This is a tooltip."
        },
        {
          element: '#step2',
          intro: "Ok, wasn't that fun?",
          position: 'right'
        },
        {
          element: '#step5',
          intro: 'Get it, use it.'
        }
      ])    
   }

  @State() split = false

  toggleMenu() {
    this.creator.menu.open()
  }

  update(ev: any) {
    if (ev.type === 'update') {
      this.options = {
        steps: (event as any).detail
      }
    }
    this.tour.start()
  }

  render() {

    return (
      <section>
        <lk-walkthrough-creator
          onUpdate={this.update.bind(this)}
          contentId="main" ref={el => this.creator = el}></lk-walkthrough-creator>
        <div id="main">
          <div>
            <h1 id="step1">Without Element</h1>
            <p id="step4" class="lead">This example shows the introduction.</p>
          </div>  
          <div>
            <ion-button onClick={() => this.toggleMenu()}>
              Toggle
            </ion-button>
            <div id="step2" class="span6">
              <h4>Section One</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
        
              <h4>Section Two</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
        
              <h4>Section Three</h4>
              <a href="https://example.com">Click Here</a>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
            </div>
            <div id="step3" class="span6">
              <h4>Section Four</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
        
        
              <h4>Section Five</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
        
              <h4>Section Six</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis augue a neque cursus ac blandit orci faucibus. Phasellus nec metus purus.</p>
            </div>
          </div>
          <lk-walkthrough ref={el => this.tour = el} options={this.options}></lk-walkthrough>
        </div>
      </section>
    );
  }
}
