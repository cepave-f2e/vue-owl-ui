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
  onChange: {
    type: Function,
  }
}
```

##Usage

```jsx
//Define a Function to handle onChange and get switch button data by its parameter
const getSwitchData = (data) => {
  console.log(data)
}

<Switch checked={true} name="demo" onChange={getSwitchData}/>

//Switch can also handle dynamic changes of `checked`
let a = true

setTimeout(() => {
  a = false
}, 2000)

<Switch checked={a}/>
```

##Demo
