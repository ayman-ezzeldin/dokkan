import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl">📚</span>
        <span className="text-xl font-bold">Dokkan</span>
      </Link>
    </div>
  );
};

export default Logo;
