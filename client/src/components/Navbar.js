const Navbar = () => {
  return (
    <div>
      <button
        type="button"
        className="btn"
        onClick={() => console.log('logout')}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
