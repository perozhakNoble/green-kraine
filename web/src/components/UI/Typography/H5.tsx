const H5 = ({
  children,
  className = '',
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div className={'text-xl ' + className} {...rest}>
      {children}
    </div>
  )
}

export default H5
