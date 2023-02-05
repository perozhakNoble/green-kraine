const H4 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-2xl ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H4
