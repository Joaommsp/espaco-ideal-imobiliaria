import React, { useRef } from "react";
import ReviewCard from "./ReviewCard";
import avatar01 from "../../public/images/avatar1.png";
import avatar02 from "../../public/images/avatar2.png";
import avatar03 from "../../public/images/avatar3.png";
import avatar04 from "../../public/images/avatar4.png";

export default function ReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex cursor-grab items-center justify-start bg-transparent px-4 md:px-10 lg:px-28 py-10 w-full gap-4 bg-[#EBF0F6] overflow-x-auto scrollbar-hide"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <ReviewCard
        icon={avatar01}
        text="Nunca imaginei que seria tão fácil encontrar um imóvel que atendesse todas as minhas expectativas. O Espaço Ideal facilitou tudo e o atendimento foi incrível"
        name="Maria Clara"
        position="Arquiteta"
      />
      <ReviewCard
        icon={avatar02}
        text="O Espaço Ideal me ajudou a encontrar o apartamento dos meus sonhos! O atendimento foi excelente, e o processo foi rápido e transparente. Super recomendo!"
        name="Ana Cristina"
        position="Designer"
      />
      <ReviewCard
        icon={avatar03}
        text="Minha experiência com o Espaço Ideal foi sensacional! Encontrei um imóvel perfeito e o processo de compra foi muito tranquilo. Recomendo a todos"
        name="José Bezerra"
        position="Aposentado"
      />
      <ReviewCard
        icon={avatar04}
        text="O site do Espaço Ideal facilitou muito minha busca por um imóvel! Encontrei uma casa maravilhosa e todo o processo foi super rápido e seguro. Recomendo demais!"
        name="Petra Aguiar"
        position="Advogada"
      />
    </div>
  );
}
