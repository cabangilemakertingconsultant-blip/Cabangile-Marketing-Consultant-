export default function Button({ children }: any) {
  return (
    <button style={{
      padding: "10px 14px",
      background: "#000",
      color: "#fff",
      borderRadius: 8
    }}>
      {children}
    </button>
  );
}