export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <a className="text-xl font-bold">Liverary</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-primary">+ Add Item</button>
      </div>
    </div>
  );
}
