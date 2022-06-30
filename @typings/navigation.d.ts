export type NavigationLink = {
  key: string
  href: string
  text: string
  description: string
  children?: NavigationLink[]
}

export type NavigationPath = {
  parent: NavigationLink[]
  current: NavigationLink
  children: NavigationLink[]
}
