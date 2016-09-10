import Select from '../../components/select'

const Home = {
  name: 'Home',
  render(h) {
    const {$slots} = this
    return (
      <div>
        This is Home Page!!
        <Select/>
      </div>
    )
  }
}

module.exports = Home
