import axios from 'axios'
import qs from 'qs'
const url = 'http://192.168.0.218:9009/home/'
export default (_url, obj) => axios.post(url + _url, qs.stringify(obj)).then(d => d.data)
