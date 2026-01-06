import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Desenvolvido por</span>
            <Image
              src="/logo-conv.jpg"
              alt="Conversion Logo"
              width={24}
              height={24}
              className="object-contain rounded"
            />
            <span className="text-sm font-medium text-gray-600">Conversion</span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
