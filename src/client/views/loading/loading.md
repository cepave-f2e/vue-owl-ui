# Loading

## Props

```js
props: {
  typ: {
    type: String,
    default: 'pie',
  },
  size: {
    type: [String, Number],
  },
  show: {
    type: Boolean,
    default: true
  }
}
```

## Usage

```jsx
<Loading typ="pie" />

//adding `width` x `height` to Loading Bar
<Loading typ="bar" size="100x10" />

//make Loading disappear
<Loading show={false} />
```

## Demo
