# Label

## Props

```js
props: {
  typ: {
    type: String,
    default: ''
    //label, outline, tag
  },
  status: {
    type: String,
    default: ''
    //six kinds of status: default, primary, success, error, warning, inverted
  },
  badge: {
    type: Boolean,
    default: false
  }
}
```

## Usage

```jsx
//Labels
<Label>Default</Label>
<Label status="primary">Primary</Label>

//Outline
<Label typ="outline">Default</Label>
<Label typ="outline" status="primary">Primary</Label>

//Tags
<Label typ="tag">Default</Label>
<Label typ="tag" status="primary">Primary</Label>

//Badges
<Label badge={true}>Default</Label>
<Label badge={true} status="primary">1</Label>

//Badge Outline
<Label badge={true} typ="outline">Default</Label>
<Label badge={true} typ="outline" status="primary">1</Label>
```

## Demo
