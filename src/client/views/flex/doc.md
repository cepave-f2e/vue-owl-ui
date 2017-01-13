# Flex

Flex is a `flex-box` grid system component.

## Props
```js
props: {
  grids: {
    type: Number,
    default: 12,
  },

  margin: {
    type: Number,
    default: 20,
  },

  mid: {
    type: Boolean,
    default: false,
  },

  split: {
    type: Boolean,
    default: false,
  },
},
```

## Flex.Col
### Props

```js
props: {
  offset: {
    type: [Number, String],
  },
  size: {
    type: [Number, String],
  },
  width: {
    type: [Number, String],
  },
  mid: {
    type: Boolean,
    default: false,
  },
},
```

## Usage

```jsx
import { Flex } from 'owl-ui'

render(h) {
  return (
    <Flex>
      <Flex.Col size="2"></Flex.Col>
      <Flex.Col size="10"></Flex.Col>
    </Flex>
  )
}
```

## Auto

```jsx
import { Flex } from 'owl-ui'

render(h) {
  return (
    <Flex>
      <Flex.Col size="auto"></Flex.Col>
      <Flex.Col size="auto"></Flex.Col>
    </Flex>
  )
}
```

## Grids
Set your grid columns, default is `12`.

```jsx
render(h) {
  return (
    <Flex grids={24}>

    </Flex>
  )
}
```

## Margin
Set the margin of each column, default is `20`.

```jsx
render(h) {
  return (
    <Flex grids={24} margin={16}>

    </Flex>
  )
}
```

## Split

```jsx
render(h) {
  return (
    <Flex split>
      <Flex.Col>left</Flex.Col>
      <Flex.Col>right</Flex.Col>
    </Flex>
  )
}
```

## Mid

```jsx
render(h) {
  return (
    <Flex mid>
      Mid Content
    </Flex>
  )
}
```

## Social Example
`Flex` also can support any typical layouts quickly and easy, for example is social media layout:

```jsx
render(h) {
  return (
    <Flex margin={12}>
      <Flex.Col >
        <div class="avatar">
          <Flex mid>
            avatar <br /> 76 x 76
          </Flex>
        </div>
      </Flex.Col>
      <Flex.Col size="auto">
        <p>Cepave @cepave said:</p>
        <p>OWL UI is No.1. :)</p>
      </Flex.Col>
    </Flex>
  )
}
```
