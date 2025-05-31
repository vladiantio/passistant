export function LoadingBlock() {
  return (
    <span style={{ fontWeight: 'bold', color: 'blue' }}>Loading...</span>
  )
}

export function ThinkBlock(props: React.PropsWithChildren) {
  return (
    <details>
      <summary>Thinking...</summary>
      {props.children}
    </details>
  )
}

export function PasswordBlock(props: React.PropsWithChildren) {
  return (
    <span style={{ fontWeight: 'bold', color: 'blue' }}>{props.children}</span>
  )
}
