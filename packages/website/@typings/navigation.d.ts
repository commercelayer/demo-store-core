export type NavigationLink = {
  key: string
  href: string
  text: string
  description: string
  children?: NavigationLink[]
}

export type Breadcrumbs = {
  parent: NavigationLink[]
  current: NavigationLink
  children: NavigationLink[]
}

export type Navigation = {
  current: NavigationLink
  path: NavigationLink[]
}
