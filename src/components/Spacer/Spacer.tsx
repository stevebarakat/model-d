function Spacer({
  width = "100%",
  height = "100%",
  children,
}: {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}) {
  return <div style={{ width, height }}>{children}</div>;
}

export default Spacer;
