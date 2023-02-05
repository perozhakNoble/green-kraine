const H3 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-3xl ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H3
