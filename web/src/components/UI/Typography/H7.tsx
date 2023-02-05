const H7 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-md ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H7
