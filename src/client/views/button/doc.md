# Button

## Props

```js
props: {
  status: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
}
```

## Usage

```jsx
//four kinds of button style: default, primary, outline, primaryOutline
<Button class={[s.buttonIcon]}>
  <Icon typ="plus" size={16} />
  新增公告
</Button>
<Button status="primaryOutline">關閉</Button>

//set width of the button to 50% relative to its upper layer
<Button status="primary" class={[s.buttonBig]}>Submit</Button>
.buttonBig {
  width: 50%;
}
```

## Demo
