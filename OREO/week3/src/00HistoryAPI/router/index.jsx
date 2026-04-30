import Home from '../page/Home'
import About from '../page/About'
import Contact from '../page/Contact'

const routes = {
  '/': Home,
  '/about': About,
  '/contact': Contact,
}

export function getComponent(path) { // ← path 받아오게 수정
  return routes[path] || (() => <h1>404 Not Found</h1>)
}