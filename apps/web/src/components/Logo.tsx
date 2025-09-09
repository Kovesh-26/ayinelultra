import Image from 'next/image';
import Link from 'next/link';

export default function Logo({
  withWordmark = true,
  size = 32,
}: {
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="Ayinel Logo"
        width={size}
        height={size}
        priority
      />
      {withWordmark && (
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#22d3ee]">
          Ayinel
        </span>
      )}
    </Link>
  );
}
