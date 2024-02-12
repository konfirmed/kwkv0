import { lusitana } from "app/ui/fonts";
export default function MCard({
    metric,
    p75,
  }: {
    metric: string;
    p75: number | string;
  }) {
  
    return (
      <div className="mt-5 rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{metric}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {p75}
        </p>
      </div>
    );
  }