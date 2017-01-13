# LightBox

## Props

```js 
props: {
  closeOnESC: {
    type: Boolean,
    default: false
  },
  closeOnClickMask: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: String,
    default: 'rgba(255, 255, 255, .8)',
  }
},
...
```

## LightBox.Open and LightBox.Close
This is a recommend way to open or close your lightbox, the default event type is `click`.

## Events

### open
Triggers when LightBox is opened.

### close
Triggers when LightBox is closed.

### Props
```js
props: {
  event: {
    type: String,
    default: 'click'
  }
},
...
```

## Usage

```jsx
<LightBox>
  <LightBox.Open>
    Open LightBox
  </LightBox.Open>
  <LightBox.View>
    ...
  </LightBox.View>
</LightBox>
```
