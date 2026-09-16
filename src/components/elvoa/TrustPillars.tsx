import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export function TrustPillars() {
  const pillars = [
    {
      title: "Nationwide Delivery",
      subtitle: "Across Bangladesh",
      icon: Truck,
    },
    {
      title: "Secure Payment",
      subtitle: "bKash, Nagad, Cards",
      icon: ShieldCheck,
    },
    {
      title: "Easy Returns",
      subtitle: "Within 7 Days",
      icon: RotateCcw,
    },
    {
      title: "Customer Support",
      subtitle: "We're Here to Help",
      icon: Headphones,
    },
  ];

  return (
    <section className="w-full bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <div className="rounded-xl bg-[#F9FAFB] border border-neutral-200/80 px-4 py-5 sm:py-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 sm:gap-3.5 px-2"
                >
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white border border-neutral-200 shrink-0 text-neutral-800 shadow-2xs">
                    <Icon className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] sm:text-[13.5px] font-bold text-neutral-900 leading-tight">
                      {item.title}
                    </span>
                    <span className="mt-0.5 text-[11px] sm:text-[11.5px] text-neutral-500">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

