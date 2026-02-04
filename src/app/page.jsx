import { SomeCard } from "@/components/some-card";

const cardList = [
  {
    id: "card-1",
    title: "Card 1",
    shortDescription: "Short description 1",
    fullDescription: "Full description 1",
  },
  {
    id: "card-2",
    title: "Card 2",
    shortDescription: "Short description 2",
    fullDescription: "Full description 2",
  },
  {
    id: "card-3",
    title: "Card 3",
    shortDescription: "Short description 3",
    fullDescription: "Full description 3",
  },
];

export default function Page() {
  return (
    <main className="p-10 flex items-center justify-center">
      <div className="flex gap-10">
        {cardList.map((card) => {
          return <SomeCard key={card.id} card={card} />;
        })}
      </div>
    </main>
  );
}
