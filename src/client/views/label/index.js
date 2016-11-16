import Label from '../../../components/label'
import Markdown from '../../components/markdown'
import s from './label.scss'

const LabelPage = {
  name: 'LabelPage',

  render(h) {
    const { $slots } = this

    return (
      <div>
        <Markdown src={require('./doc.md')} />
        Labels
        <div class={[s.group]}>
          <Label>Default</Label>
          <Label status="primary">Primary</Label>
          <Label status="error">Error</Label>
          <Label status="success">Success</Label>
          <Label status="warning">Warning</Label>
          <span class={[s.dark]}>
            <Label status="inverted">Inverted</Label>
          </span>
        </div>
        Outline
        <div class={[s.group]}>
          <Label typ="outline">Default</Label>
          <Label typ="outline" status="primary">Primary</Label>
          <Label typ="outline" status="error">Error</Label>
          <Label typ="outline" status="success">Success</Label>
          <Label typ="outline" status="warning">Warning</Label>
          <span class={[s.dark]}>
            <Label typ="outline" status="inverted">Inverted</Label>
          </span>
        </div>
        Tags
        <div class={[s.group]}>
          <Label typ="tag">Default</Label>
          <Label typ="tag" status="primary">Primary</Label>
          <Label typ="tag" status="error">Error</Label>
          <Label typ="tag" status="success">Success</Label>
          <Label typ="tag" status="warning">Warning</Label>
          <span class={[s.dark]}>
            <Label typ="tag" status="inverted">Inverted</Label>
          </span>
        </div>
        Badges
        <div class={[s.group]}>
          <Label badge={true}>Default</Label>
          <Label badge={true} status="primary">1</Label>
          <Label badge={true} status="error">2</Label>
          <Label badge={true} status="success">3</Label>
          <Label badge={true} status="warning">4</Label>
          <span class={[s.dark]}>
            <Label badge={true} status="inverted">5</Label>
          </span>
        </div>
        Badge Outline
        <div class={[s.group]}>
          <Label badge={true} typ="outline">Default</Label>
          <Label badge={true} typ="outline" status="primary">1</Label>
          <Label badge={true} typ="outline" status="error">2</Label>
          <Label badge={true} typ="outline" status="success">3</Label>
          <Label badge={true} typ="outline" status="warning">4</Label>
          <span class={[s.dark]}>
            <Label badge={true} typ="outline" status="inverted">5</Label>
          </span>
        </div>
      </div>
    )
  }
}

module.exports = LabelPage
