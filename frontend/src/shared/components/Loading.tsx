interface LoadingProps {
  mensaje: string;
}

function Loading({ mensaje }: LoadingProps) {
  return <p className="py-6 text-slate-500">{mensaje}</p>;
}

export default Loading;