export type NavigationLink = {
  key: string
  href: string
  text: string
}

export type NavigationPath = {
  parent: NavigationLink[]
  current: NavigationLink
  children: NavigationLink[]
}
