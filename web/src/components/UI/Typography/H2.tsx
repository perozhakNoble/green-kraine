const H2 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-4xl ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H2
