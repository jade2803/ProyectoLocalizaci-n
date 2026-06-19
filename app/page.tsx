import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-6">
      <Link
        href="/ar/imagenes"
        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl"
      >
        Ir a Imágenes
      </Link>

      <Link
        href="/ar/consulta"
        className="bg-green-600 text-white px-8 py-4 rounded-xl text-xl"
      >
        Ir a Consulta
      </Link>

      <Link
        href="/ar/laboratorio"
        className="w-72 bg-purple-600 text-white px-8 py-4 rounded-xl text-xl"
      >
        Ir a Laboratorio Clínico
      </Link>
    </main>
  );
}