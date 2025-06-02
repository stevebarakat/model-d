function Spacer({
  width = "100%",
  height = "100%",
  children,
  style,
}: {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{ width, height, ...style }}>{children}</div>;
}

export default Spacer;
