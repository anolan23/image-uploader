import '../sass/global.scss';

function Preview({ onDrop, children }) {
  return (
    <div
      className="preview"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

export default Preview;
