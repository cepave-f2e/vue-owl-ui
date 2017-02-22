#Switch

##props

```js
props: {
  checked: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'data'
  },
  typ: {
    type: String,
    default: 'default'
    //two different type: 'default' and 'special'
  }
}
```

##Switch.Open and Switch.Close
This is the recommended way to put words in Switch Button

##Usage

get `<Switch />` value from `this.$refs.switchref.check`
```jsx
<Switch checked name="switch1" ref="switchref" typ="special" />
```

Use `onChange` as a listener to get data from `$emit('change')`
```jsx
//Define a Function to handle onChange and get switch button data
const getSwitchData = (data) => {
  console.log(data)
}

<Switch checked={true} name="demo1" onChange={getSwitchData}/>
```
Switch can also handle dynamic changes of `checked`
```jsx
let a = true

setTimeout(() => {
  a = false
}, 2000)

<Switch checked={a}/>
```
Use `<Switch.Open>` and `<Switch.Close>` to put words into Switch Button
```jsx
<Switch checked={true} name="demo2" typ="special" onChange={getSwitchData}>
  <Switch.Open>開</Switch.Open>
  <Switch.Close>關</Switch.Close>
</Switch>
```

##Demo
