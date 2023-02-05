const H6 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-lg ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H6
