export const AbsoluteCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center"
      }}
    >
      {children}
    </div>
  );
};
