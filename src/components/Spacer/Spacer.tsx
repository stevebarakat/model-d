function Spacer({
  width = "100%",
  height = "100%",
}: {
  width?: string;
  height?: string;
}) {
  return <div style={{ width, height }}></div>;
}

export default Spacer;
