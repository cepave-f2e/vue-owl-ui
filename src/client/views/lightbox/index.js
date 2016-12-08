import LightBox from '~com/light-box'
import Markdown from '../../components/markdown'

const LightBoxPage = {
  name: 'LightBoxPage',
  methods: {

  },
  render(h) {
    const content =
      <div>
        <h2>LightBox</h2>
        <p>
          Lightbox is a JavaScript library that displays images and videos by filling the screen, and dimming out the rest of the web page.[1]
        </p>

        <p>
          The original JavaScript library was written by Lokesh Dhakar with the help of riphath.[2] The term Lightbox may also refer to other similar JavaScript libraries. The technique gained widespread popularity due to its simple and elegant style.
        </p>

        <p>
          The original Lightbox library used two JavaScript libraries, Prototype Javascript Framework[3] and script.aculo.us,[4] for its animations and positioning. In April 2012, the plugin was rewritten for jQuery.[5] The open-source nature of Lightbox encouraged developers to modify and fork the code, resulting in plugins such as Colorbox, Magnific Popup, Slimbox or Thickbox.
        </p>

        <p>
          Lightbox scripts are dependent upon a browser's JavaScript support,.[6] Many Lightbox scripts use unobtrusive JavaScript. Browsers that do not load the script for whatever reason can instead simply load the image as a separate page load, losing the Lightbox effect but still retaining the ability to display the image.[7]
        </p>

        <h3>Bypassing</h3>
        <p>
          The user may use a developer tool such as Chrome's Inspect Element, to remove and add the code for it from the DOM. [8] Adblock Plus as an example, has the ability to block these elements using Element Hiding Helper or manually written rules. [9]
        </p>
      </div>

    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <LightBox closeOnClickMask closeOnESC width={600}>
          <LightBox.Open>
            <a href="#">Open lightbox</a>
          </LightBox.Open>

          <LightBox.View>
            <h1 >LightBox long content demo</h1>
            {content}
            {content}
          </LightBox.View>
        </LightBox>
      </div>
    )
  }
}

module.exports = LightBoxPage
