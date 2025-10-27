import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/images/logo.png"
          alt="Dokkan Logo"
          width={42}
          height={42}
          className="w-20 h-12"
        />
      </Link>
    </div>
  );
};

export default Logo;
