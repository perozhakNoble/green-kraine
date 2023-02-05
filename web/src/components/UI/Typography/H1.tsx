const H1 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-5xl ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H1
