export const contentListCardClassName =
  'group relative cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm shadow-black/[0.04] hover:border-border hover:bg-muted/35 hover:shadow-md hover:shadow-black/[0.07] dark:bg-card/75 dark:shadow-black/25 dark:hover:bg-card/90 dark:hover:shadow-lg dark:hover:shadow-black/35'

const baseButton =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const buttonVariant = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline:
    'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
  ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
}

const buttonSize = {
  default: 'h-9 px-4 py-2 has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 rounded-md px-3',
  icon: 'size-9',
}

export function buttonClass(
  variant: keyof typeof buttonVariant = 'default',
  size: keyof typeof buttonSize = 'sm',
  extra = ''
): string {
  return [baseButton, buttonVariant[variant], buttonSize[size], extra].filter(Boolean).join(' ')
}

const badgeBase =
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden font-sans'

const badgeVariant = {
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'text-foreground',
}

const badgeRole = {
  category: 'text-[13px] font-semibold leading-tight tracking-tight',
  tag: 'text-[13px] font-medium leading-snug tracking-wide',
  meta: 'text-xs font-normal leading-normal tabular-nums tracking-normal',
}

export function badgeClass(
  variant: keyof typeof badgeVariant,
  role: keyof typeof badgeRole,
  extra = ''
): string {
  return [badgeBase, badgeVariant[variant], badgeRole[role], extra].filter(Boolean).join(' ')
}
