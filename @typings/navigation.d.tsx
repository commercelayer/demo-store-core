export type NavigationLink = {
  key: string
  href: string
  text: string
  description: string
}

export type NavigationPath = {
  parent: NavigationLink[]
  current: NavigationLink
  children: NavigationLink[]
}
