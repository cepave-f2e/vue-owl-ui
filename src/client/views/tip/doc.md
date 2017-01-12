# Tip

## Props

```js
props: {
  pos: {
    type: String,
    default: 'down',
  },
  event: {
    type: String,
    default: 'mouseenter'
  },
  delay: {
    type: Number,
    default: 50
  }
}
```

## Usage

```jsx
<Tip pos="right">
  hover me
  <Tip.Context>
    I am a tip
  </Tip.Context>
</Tip>
```

## Demo
