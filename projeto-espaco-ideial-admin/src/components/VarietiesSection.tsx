import VarietyCard from "./VarietyCard";

import apartamentoIcon from "../../public/icons/apartamentos-icon.png";
import casaIcon from "../../public/icons/casa-icon.png";
import comercialIcon from "../../public/icons/comercial-icon.png";
import praiIcon from "../../public/icons/praia-icon.png";

export default function VarietiesSection() {
  return (
    <div className="flex flex-wrap items-center bg-transparent px-4 md:px-20 py-5 md:py-10 w-full justify-center gap-4 bg-[#EBF0F6]">
      <VarietyCard
        title="Apartamentos"
        text="Apartamentos de diversos padrões"
        icon={apartamentoIcon}
      />
      <VarietyCard
        title="Casas"
        text="Propriedades para todos os tamanhos"
        icon={casaIcon}
      />
      <VarietyCard
        title="Comercial"
        text="Localidades de propriedades Comerciais"
        icon={comercialIcon}
      />
      <VarietyCard
        title="Casas de praia"
        text="Encontre propriedades perto do mar"
        icon={praiIcon}
      />
    </div>
  );
}
