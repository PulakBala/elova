import Link from "next/link";
import Image from "next/image";
import { mainCategories } from "@/data/categories";

export function CategoryIcons() {
  return (
    <section className="w-full bg-white pt-4 pb-2">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        {/* Horizontal scroll container on mobile, full grid on desktop */}
        <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2 scrollbar-none sm:gap-3 lg:grid lg:grid-cols-10 lg:gap-3 lg:overflow-visible">
          {mainCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center shrink-0 w-[68px] sm:w-[76px] lg:w-auto transition-transform hover:-translate-y-0.5"
            >
              {/* Rounded Icon Box */}
              <div className="flex h-13 w-13 sm:h-14 sm:w-14 lg:h-15 lg:w-full items-center justify-center rounded-xl sm:rounded-2xl bg-[#F3F4F6] p-2 transition-colors group-hover:bg-[#E5E7EB]">
                <div className="relative h-9 w-9 sm:h-10 sm:w-10">
                  <Image
                    src={cat.iconImage}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Category Label */}
              <span className="mt-1.5 text-center text-[10.5px] sm:text-[11.5px] font-medium text-neutral-800 leading-tight group-hover:text-[#FF5B37] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
