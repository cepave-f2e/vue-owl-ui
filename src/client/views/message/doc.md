# Message

## Props

```js
props: {
  message: {
    type: String,
  },

  type: {
    type: String,
    default: 'primary' // primary, error, warning, success
  },

  duration: {
    type: Number,
    default: 3000 // it will not be turned off automatically if set to 0
  },

  showClose: {
    type: Boolean,
    default: false
  },

  iconClass: {
    type: String, // set a custom icon class, will override type attribute
  },

  onClose: {
    type: Function // trigger a callback function when close the message
  }
}
```

## Usage
```jsx
export default {
  methods: {
    open(event) {
      Message('Hello!')
    },
    open_warning() {
      event.preventDefault()
      Message({
        message: 'Warning!',
        type: 'warning',
        duration: 0,
        showClose: true
      })
    }
  }
}

<Button status="primaryOutline" nativeOnClick={this.open}>Hello message!</Button>
<a href="#" onClick={this.open_warning}>Warning</a>
```

## Parameter
### String
`Message()` method is able to take a simple string as a parameter for basic usage.
```jsx
Message('Hello!')
```
### Object
`Message()` method is also able to take an object as a parameter for more customizations.
```jsx
Message({
  message: 'Warning!',
  type: 'warning',
  duration: 0,
  showClose: true
})
```

## Demo
