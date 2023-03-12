

// Componente que se trata de un loaders para mostrar mientras se cargan los NFTs


const Loader = () => (
    <div className="flex items-center justify-center py-3">
      <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-fuchsia-500" />
    </div>
  );
  
export default Loader;